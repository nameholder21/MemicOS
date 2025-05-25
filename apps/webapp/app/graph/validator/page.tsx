'use client';

import UploadGraphModal from '@/app/[modelId]/graph/upload-graph-modal';
import { ATTRIBUTION_GRAPH_SCHEMA } from '@/app/[modelId]/graph/utils';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Label } from '@/components/shadcn/label';
import Ajv from 'ajv';
import { AlertCircle, CheckCircle2, Copy, FileText } from 'lucide-react';
import { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  summary?: {
    nodesCount: number;
    linksCount: number;
    slug: string;
    scan: string;
  };
}

export default function GraphValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateJson = async () => {
    setIsValidating(true);

    try {
      // First, try to parse the JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(jsonInput);
      } catch (parseError) {
        setValidationResult({
          isValid: false,
          errors: [
            `Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`,
          ],
        });
        setIsValidating(false);
        return;
      }

      // Then validate against schema
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(ATTRIBUTION_GRAPH_SCHEMA);
      const isValid = validate(parsedJson);

      if (isValid) {
        // Extract summary information
        const summary = {
          nodesCount: parsedJson.nodes?.length || 0,
          linksCount: parsedJson.links?.length || 0,
          slug: parsedJson.metadata?.slug || 'N/A',
          scan: parsedJson.metadata?.scan || 'N/A',
        };

        setValidationResult({
          isValid: true,
          errors: [],
          summary,
        });
      } else {
        const errors = validate.errors?.map((error) => {
          const path = error.instancePath || 'root';
          return `${path}: ${error.message}`;
        }) || ['Unknown validation error'];

        setValidationResult({
          isValid: false,
          errors,
        });
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      });
    }

    setIsValidating(false);
  };

  const copySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(ATTRIBUTION_GRAPH_SCHEMA, null, 2));
  };

  const loadSampleJson = () => {
    const sampleJson = {
      metadata: {
        slug: 'sample-graph',
        scan: 'gemma-2-2b',
        prompt_tokens: ['The', ' cat', ' sat', ' on', ' the', ' mat'],
        prompt: 'The cat sat on the mat',
        info: {
          title: 'Sample Attribution Graph',
          description: 'A sample graph for testing purposes',
        },
      },
      qParams: {
        pinnedIds: [],
        supernodes: [],
        linkType: 'both',
      },
      nodes: [
        {
          node_id: '0_253_1',
          feature: 253,
          layer: '0',
          ctx_idx: 1,
          feature_type: 'embedding',
          jsNodeId: '0_253-0',
          clerp: 'sample feature label',
          influence: 0.48267510533332825,
          activation: 9.449039459228516,
        },
      ],
      links: [
        {
          source: 'E_2_0',
          target: '0_253_1',
          weight: 12.964216232299805,
        },
      ],
    };

    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Attribution Graph Validator</h1>
        <p className="text-gray-600">
          Validate your JSON against the Anthropic Attribution Graph schema. Paste your JSON below to check if it
          conforms to the required format.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              JSON Input
            </CardTitle>
            <CardDescription>Paste your attribution graph JSON here for validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="json-input">JSON Data</Label>
              <ReactTextareaAutosize
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="max-h-[400px] min-h-[200px] w-full resize-none rounded-md border p-3 font-mono text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                minRows={12}
                maxRows={12}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={validateJson}
                disabled={!jsonInput.trim() || isValidating}
                className="flex-1 sm:flex-none"
              >
                {isValidating ? 'Validating...' : 'Validate JSON'}
              </Button>
              <Button variant="outline" onClick={loadSampleJson} className="flex-1 sm:flex-none">
                Load Sample
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setJsonInput('');
                  setValidationResult(null);
                }}
                className="flex-1 sm:flex-none"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult?.isValid === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {validationResult?.isValid === false && <AlertCircle className="h-5 w-5 text-red-500" />}
              Validation Results
            </CardTitle>
            <CardDescription>
              {validationResult ? 'Validation complete' : 'No validation performed yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validationResult ? (
              <div className="space-y-4">
                {validationResult.isValid ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Valid Attribution Graph!</span>
                    </div>

                    {validationResult.summary && (
                      <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium text-gray-900">Graph Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Nodes:</span> {validationResult.summary.nodesCount}
                          </div>
                          <div>
                            <span className="font-medium">Links:</span> {validationResult.summary.linksCount}
                          </div>
                          <div>
                            <span className="font-medium">Slug:</span> {validationResult.summary.slug}
                          </div>
                          <div>
                            <span className="font-medium">Scan:</span> {validationResult.summary.scan}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col justify-start text-sm">
                      <div className="mb-2 text-xs">
                        Click this button to upload the graph. Note that only specific models/scans are supported right
                        now.
                      </div>
                      <UploadGraphModal />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Validation Failed</span>
                    </div>

                    <div className="rounded-lg bg-red-50 p-4">
                      <h4 className="mb-2 font-medium text-red-900">Errors Found:</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        {validationResult.errors.map((error, index) => (
                          <li key={index} className="rounded border-l-4 border-red-300 bg-white p-2 font-mono">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <FileText className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p>Enter JSON to the left and click &quot;Validate JSON&quot;</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schema Reference */}
      <Card className="mb-6 mt-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Schema Reference
            <Button variant="outline" size="sm" onClick={copySchema}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Schema
            </Button>
          </CardTitle>
          <CardDescription>The JSON schema that your attribution graph must conform to</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg bg-gray-50 p-4 text-xs">
            {JSON.stringify(ATTRIBUTION_GRAPH_SCHEMA, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
