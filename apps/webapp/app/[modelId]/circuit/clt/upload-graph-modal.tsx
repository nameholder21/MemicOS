'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { Progress } from '@/components/shadcn/progress';
import { ChartScatter, Loader2, UploadCloud } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CLTGraph, makeGraphPublicAccessGraphUrl } from './clt-utils';

export default function UploadGraphModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [graphData, setGraphData] = useState<CLTGraph | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const session = useSession();
  const { setSignInModalOpen } = useGlobalContext();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileToUpload = e.target.files?.[0];
    if (!fileToUpload) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setIsUploadSuccess(false);
      setGraphData(null);

      // Get signed upload URL
      const response = await fetch('/api/graph/signed-put', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: 'application/json',
          contentLength: fileToUpload.size,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { url, putRequestId } = await response.json();

      // Extract the clean S3 URL without query parameters for GET check
      const cleanedURL = url.split('?')[0];

      // Check if file already exists in S3
      try {
        const checkResponse = await fetch(cleanedURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // If file exists (200 OK), ask for confirmation before overwriting
        if (checkResponse.ok) {
          const shouldOverwrite = window.confirm(
            'WARNING: You already have a graph with this same filename.\n\nDo you want to overwrite it?',
          );

          // If user cancels overwrite, abort the upload
          if (!shouldOverwrite) {
            setIsUploading(false);
            return;
          }
        }
      } catch (error) {
        // If error occurs during check, it likely means file doesn't exist
        // Continue with upload in this case
        console.log("File doesn't exist so we can continue with upload:", error);
      }

      // Upload file to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Content-Length', fileToUpload.size.toString());
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      // Return a promise that resolves or rejects based on the XHR response
      await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve(xhr.response);
          } else {
            // Handle HTTP errors including 403
            const errorMsg =
              xhr.status === 403
                ? 'Permission denied. You may not have access to upload files.'
                : `Upload failed with status ${xhr.status}`;
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.send(fileToUpload);
      });

      // Set upload success and store filename for later download
      setIsUploadSuccess(true);
      setUploadedFilename(fileToUpload.name);

      // Download and parse the file immediately
      // eslint-disable-next-line
      await downloadParseAndPersistGraph(url, putRequestId);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      alert(`Error uploading graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadParseAndPersistGraph = async (url: string, putRequestId: string) => {
    try {
      setIsDownloading(true);

      // Download the file
      // Strip query parameters from the URL
      const cleanUrl = url.split('?')[0];
      const response = await fetch(cleanUrl);
      if (!response.ok) {
        throw new Error('Failed to download the uploaded file');
      }

      // Parse the JSON data
      const data = (await response.json()) as CLTGraph;

      // Validate that it's a CLTGraph
      if (!data.metadata || !data.nodes || !data.links) {
        throw new Error('Invalid graph format');
      }

      // we only need putRequestId because we have the request in the database, which we use to look up
      const saveResponse = await fetch('/api/graph/save-to-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          putRequestId,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save graph metadata to database');
      }

      // Set and show the graph data here
      setGraphData(data as CLTGraph);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenGraph = () => {
    if (graphData) {
      setIsOpen(false);

      window.location.href = makeGraphPublicAccessGraphUrl(graphData.metadata.scan, graphData.metadata.slug);
    }
  };

  if (!session.data?.user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex h-12 items-center justify-center border-slate-300"
        onClick={() => {
          setSignInModalOpen(true);
        }}
      >
        <UploadCloud className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset states when closing the modal
          setUploadProgress(0);
          setIsUploading(false);
          setIsUploadSuccess(false);
          setGraphData(null);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          title="Upload Graph"
          aria-label="Upload Graph"
          size="sm"
          className="flex h-12 items-center justify-center whitespace-nowrap border-slate-300 text-sm text-slate-500 hover:bg-slate-50"
        >
          <UploadCloud className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="cursor-default select-none bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Graph</DialogTitle>
        </DialogHeader>

        {!isUploadSuccess ? (
          // Initial upload state
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Upload a JSON graph generated by the{' '}
              <a
                href="https://github.com/safety-research/open-source-circuit-finding"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
              >
                circuit finding tool
              </a>
              . You can also use the API to upload.
            </p>
            <div className="relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
              <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">JSON files only</p>
              <input
                type="file"
                id="graphUpload"
                accept=".json"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-3 w-full" />
                <p className="text-center text-xs text-slate-500">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
        ) : (
          // Success state showing metadata and download status
          <div className="mt-4 flex flex-col gap-4">
            {isDownloading ? (
              // Downloading state
              <div className="flex flex-col items-center justify-center gap-4 py-6">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                <p className="text-sm text-slate-600">Validating and persisting metadata...</p>
              </div>
            ) : graphData ? (
              // Graph data loaded state
              <div className="space-y-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <h3 className="mb-2 text-sm font-medium text-slate-700">Graph Uploaded Successfully</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p>
                      <span className="font-medium">Filename:</span> {uploadedFilename}
                    </p>
                    <p>
                      <span className="font-medium">Graph ID (slug):</span> {graphData.metadata.slug}
                    </p>
                    <p>
                      <span className="font-medium">Prompt:</span> {graphData.metadata.prompt}
                    </p>
                    <p>
                      <span className="font-medium">Model:</span> {graphData.metadata.scan}
                    </p>
                    <p>
                      <span className="font-medium">Nodes:</span> {graphData.nodes.length}
                    </p>
                    <p>
                      <span className="font-medium">Links:</span> {graphData.links.length}
                    </p>
                  </div>
                </div>

                <Button onClick={handleOpenGraph} className="w-full bg-sky-600 text-white hover:bg-sky-700">
                  <ChartScatter className="mr-2 h-4 w-4" />
                  Open Graph
                </Button>
              </div>
            ) : (
              // Error state
              <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-800">
                <p>Failed to load graph data. Please try uploading again.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsUploadSuccess(false)}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
