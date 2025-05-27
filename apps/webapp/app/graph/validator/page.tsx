'use client';

import UploadGraphModal from '@/app/[modelId]/graph/upload-graph-modal';
import { ATTRIBUTION_GRAPH_SCHEMA } from '@/app/[modelId]/graph/utils';
import FEATURE_DETAILS_SCHEMA from '@/app/api/graph/feature-details-schema.json';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Label } from '@/components/shadcn/label';
import Ajv from 'ajv';
import { AlertCircle, CheckCircle2, Copy, FileText, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
  featureDetailsInfo?: {
    type: 'missing' | 'base_url' | 'memicos_source_set';
    message: string;
    baseUrl?: string;
    sourceSet?: string;
  };
  summary?: {
    nodesCount: number;
    linksCount: number;
    slug: string;
    scan: string;
  };
}

interface FeatureValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
  summary?: {
    layer?: number;
    index: number;
    quantilesCount: number;
    examplesCount: number;
    topLogitsCount: number;
    bottomLogitsCount: number;
  };
}

export default function GraphValidator() {
  // Graph validator state
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Feature validator state
  const [featureJsonInput, setFeatureJsonInput] = useState('');
  const [featureValidationResult, setFeatureValidationResult] = useState<FeatureValidationResult | null>(null);
  const [isValidatingFeature, setIsValidatingFeature] = useState(false);

  const findMissingOptionalFields = (parsedJson: any): string[] => {
    const suggestions: string[] = [];

    // Check if feature_details configuration already exists
    const hasFeatureJsonBaseUrl = parsedJson.metadata?.feature_details?.feature_json_base_url;
    const hasMemicOSSourceSet = parsedJson.metadata?.feature_details?.memicos_source_set;

    const traverseSchema = (schemaObj: any, dataObj: any, path: string = '', parentPath: string = '') => {
      if (!schemaObj || typeof schemaObj !== 'object') return;

      // Handle object properties
      if (schemaObj.properties) {
        const required = schemaObj.required || [];
        const { properties } = schemaObj;

        for (const [key, propSchema] of Object.entries(properties)) {
          const currentPath = path ? `${path}.${key}` : key;
          const isRequired = required.includes(key);
          const isPresent = dataObj && Object.hasOwn(dataObj, key);

          // Skip qParams section
          if (currentPath === 'qParams' || currentPath.startsWith('qParams.')) {
            // eslint-disable-next-line no-continue
            continue;
          }

          // Skip mutually exclusive feature_details options
          if (currentPath === 'metadata.feature_details.feature_json_base_url' && hasMemicOSSourceSet) {
            // eslint-disable-next-line no-continue
            continue;
          }
          if (currentPath === 'metadata.feature_details.memicos_source_set' && hasFeatureJsonBaseUrl) {
            // eslint-disable-next-line no-continue
            continue;
          }

          if (!isRequired && !isPresent) {
            // This is an optional field that's missing
            const description = (propSchema as any)?.description || '';
            const suggestion = description ? `${currentPath} - ${description}` : `${currentPath} - Optional field`;
            suggestions.push(suggestion);
          } else if (isPresent && dataObj[key] && typeof dataObj[key] === 'object') {
            // Recursively check nested objects
            if (Array.isArray(dataObj[key])) {
              // Handle arrays - check the first item against the items schema
              if ((propSchema as any)?.items && dataObj[key].length > 0) {
                traverseSchema((propSchema as any).items, dataObj[key][0], `${currentPath}[]`, currentPath);
              }
            } else {
              // Handle nested objects
              traverseSchema(propSchema, dataObj[key], currentPath, path);
            }
          }
        }
      }

      // Handle array items
      if (schemaObj.items && schemaObj.items.properties) {
        traverseSchema(schemaObj.items, dataObj, path, parentPath);
      }
    };

    // Start traversal from the root schema
    traverseSchema(ATTRIBUTION_GRAPH_SCHEMA, parsedJson);

    return suggestions;
  };

  const findMissingOptionalFieldsFeature = (parsedJson: any): string[] => {
    const suggestions: string[] = [];

    const traverseSchema = (schemaObj: any, dataObj: any, path: string = '') => {
      if (!schemaObj || typeof schemaObj !== 'object') return;

      // Handle object properties
      if (schemaObj.properties) {
        const required = schemaObj.required || [];
        const { properties } = schemaObj;

        for (const [key, propSchema] of Object.entries(properties)) {
          const currentPath = path ? `${path}.${key}` : key;
          const isRequired = required.includes(key);
          const isPresent = dataObj && Object.hasOwn(dataObj, key);

          if (!isRequired && !isPresent) {
            // This is an optional field that's missing
            const description = (propSchema as any)?.description || '';
            const suggestion = description ? `${currentPath} - ${description}` : `${currentPath} - Optional field`;
            suggestions.push(suggestion);
          } else if (isPresent && dataObj[key] && typeof dataObj[key] === 'object') {
            // Recursively check nested objects
            if (Array.isArray(dataObj[key])) {
              // Handle arrays - check the first item against the items schema
              if ((propSchema as any)?.items && dataObj[key].length > 0) {
                traverseSchema((propSchema as any).items, dataObj[key][0], `${currentPath}[]`);
              }
            } else {
              // Handle nested objects
              traverseSchema(propSchema, dataObj[key], currentPath);
            }
          }
        }
      }

      // Handle array items
      if (schemaObj.items && schemaObj.items.properties) {
        traverseSchema(schemaObj.items, dataObj, path);
      }
    };

    // Start traversal from the root schema
    traverseSchema(FEATURE_DETAILS_SCHEMA, parsedJson);

    return suggestions;
  };

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

        // Find missing optional fields
        const suggestions = findMissingOptionalFields(parsedJson);

        // Check feature details configuration
        let featureDetailsInfo;
        if (!parsedJson.metadata?.feature_details) {
          featureDetailsInfo = {
            type: 'missing' as const,
            message:
              'Feature details will not be displayed because metadata.feature_details is not specified. See the top of this page for how to specify it.',
          };
        } else if (parsedJson.metadata.feature_details.feature_json_base_url) {
          featureDetailsInfo = {
            type: 'base_url' as const,
            message: `Features will be expected at: ${parsedJson.metadata.feature_details.feature_json_base_url}/[feature].json`,
            baseUrl: parsedJson.metadata.feature_details.feature_json_base_url,
          };
        } else if (parsedJson.metadata.feature_details.memicos_source_set) {
          featureDetailsInfo = {
            type: 'memicos_source_set' as const,
            message: `Using MemicOS source set: ${parsedJson.metadata.feature_details.memicos_source_set}. We expect in your graph json file, nodes.feature will be cantor-paired. If this is a new model/sourceSet, ensure that you have created them on MemicOS.`,
            sourceSet: parsedJson.metadata.feature_details.memicos_source_set,
          };
        }

        setValidationResult({
          isValid: true,
          errors: [],
          suggestions,
          featureDetailsInfo,
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

  const validateFeatureJson = async () => {
    setIsValidatingFeature(true);

    try {
      // First, try to parse the JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(featureJsonInput);
      } catch (parseError) {
        setFeatureValidationResult({
          isValid: false,
          errors: [
            `Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`,
          ],
        });
        setIsValidatingFeature(false);
        return;
      }

      // Then validate against schema
      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(FEATURE_DETAILS_SCHEMA);
      const isValid = validate(parsedJson);

      if (isValid) {
        // Extract summary information
        const summary = {
          layer: parsedJson.layer,
          index: parsedJson.index,
          quantilesCount: parsedJson.examples_quantiles?.length || 0,
          examplesCount:
            parsedJson.examples_quantiles?.reduce((total: number, q: any) => total + (q.examples?.length || 0), 0) || 0,
          topLogitsCount: parsedJson.top_logits?.length || 0,
          bottomLogitsCount: parsedJson.bottom_logits?.length || 0,
        };

        // Find missing optional fields
        const suggestions = findMissingOptionalFieldsFeature(parsedJson);

        setFeatureValidationResult({
          isValid: true,
          errors: [],
          suggestions,
          summary,
        });
      } else {
        const errors = validate.errors?.map((error) => {
          const path = error.instancePath || 'root';
          return `${path}: ${error.message}`;
        }) || ['Unknown validation error'];

        setFeatureValidationResult({
          isValid: false,
          errors,
        });
      }
    } catch (error) {
      setFeatureValidationResult({
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      });
    }

    setIsValidatingFeature(false);
  };

  const copySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(ATTRIBUTION_GRAPH_SCHEMA, null, 2));
  };

  const copyFeatureSchema = () => {
    navigator.clipboard.writeText(JSON.stringify(FEATURE_DETAILS_SCHEMA, null, 2));
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
        feature_details: {
          feature_json_base_url: 'https://example.com/features',
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

  const loadSampleFeatureJson = () => {
    const sampleJson = {
      layer: 5,
      index: 1234,
      examples_quantiles: [
        {
          quantile_name: 'top',
          examples: [
            {
              tokens_acts_list: [0.1, 0.5, 0.8, 0.3, 0.2],
              tokens: ['The', ' quick', ' brown', ' fox', ' jumps'],
            },
            {
              tokens_acts_list: [0.2, 0.7, 0.9, 0.4, 0.1],
              tokens: ['A', ' sample', ' text', ' with', ' tokens'],
            },
          ],
        },
        {
          quantile_name: 'middle',
          examples: [
            {
              tokens_acts_list: [0.05, 0.15, 0.25, 0.35, 0.45],
              tokens: ['Another', ' example', ' of', ' text', ' tokens'],
            },
          ],
        },
      ],
      top_logits: ['token1', 'token2', 'token3'],
      bottom_logits: ['tokenA', 'tokenB', 'tokenC'],
    };

    setFeatureJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Graph & Feature Validators</h1>
        <p className="text-gray-600">
          Validate your JSON against the Anthropic Attribution Graph schema and Feature Details schema.
        </p>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 font-medium text-amber-900">📤 Uploading Graphs to MemicOS</h3>
          <p className="mb-2 text-sm text-amber-800">
            To upload your own graphs to MemicOS, you need to ensure that the{' '}
            <code className="rounded bg-white px-1 py-0.5 text-xs">scan</code> field in your graph metadata matches a
            model that exists on MemicOS:
          </p>
          <ol className="list-decimal space-y-2 pl-6 text-sm text-amber-800">
            <li>
              Check{' '}
              <a
                href="https://memicos.org"
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 underline hover:text-amber-800"
              >
                memicos.org
              </a>{' '}
              for available models
            </li>
            <li>
              Or use the{' '}
              <a
                href="https://github.com/hijohnnylin/memicos/blob/main/packages/python/memicos-webapp-client/memicos/examples/new-model.ipynb"
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 underline hover:text-amber-800"
              >
                MemicOS API/library to create a new model entry
              </a>{' '}
              that matches your scan value
            </li>
          </ol>
        </div>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-900">🔗 Feature Details Configuration</h3>
          <div className="text-sm leading-normal text-blue-800">
            <p className="mb-2 font-bold">To show Feature Details on MemicOS, you can either:</p>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong>Host the feature JSONs yourself.</strong>
                <br />
                In your graph JSON, specify a{' '}
                <code className="rounded bg-white px-1 py-0.5 text-xs">
                  metadata.feature_details.feature_json_base_url
                </code>{' '}
                for us to look it up. This is the base URL for your feature JSON files. If a base url is
                https://my-cloudfront.s3.amazonaws.com/my_model/features, then the feature JSON would be at
                https://my-cloudfront.s3.amazonaws.com/my_model/features/1234.json. Remember to enable public access,
                CORS from all origins, and https.
              </li>
              <li>
                <strong>
                  Use {`MemicOS's`} feature dashboards (or{' '}
                  <a
                    href="https://github.com/hijohnnylin/memicos/blob/main/packages/python/memicos-webapp-client/memicos/examples/upload_features.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 underline hover:text-blue-800"
                  >
                    upload your own to MemicOS
                  </a>
                  ).
                </strong>
                <br />
                In your graph JSON, specify a{' '}
                <code className="rounded bg-white px-1 py-0.5 text-xs">
                  metadata.feature_details.memicos_source_set
                </code>{' '}
                to use {`MemicOS's`} feature dashboards, if it already exists on MemicOS, or if you have{' '}
                <a
                  href="https://github.com/hijohnnylin/memicos/blob/main/packages/python/memicos-webapp-client/memicos/examples/upload_features.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline hover:text-blue-800"
                >
                  uploaded them yourself
                </a>
                . If you choose this route, you need to ensure that in your graph json file, the node feature numbers
                are{' '}
                <a
                  href="https://www.cantorsparadise.com/cantor-pairing-function-e213a8a89c2b"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline hover:text-blue-800"
                >
                  cantor-paired
                </a>
                : feature = cantor(layer_num, feat_index) = (layer_num + feat_index) * (layer_num + feat_index + 1) / 2
                + feat_index
              </li>
            </ol>
          </div>
        </div>

        {/* Jump Links */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <a href="#graph-validator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Jump to Graph Validator
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-50">
            <a href="#feature-validator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Jump to Feature Validator
            </a>
          </Button>
        </div>
      </div>

      {/* Attribution Graph Validator */}
      <div className="mb-12">
        <h2 id="graph-validator" className="mb-6 text-2xl font-semibold" style={{ scrollMarginTop: '64px' }}>
          Attribution Graph Validator
        </h2>
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

                      {validationResult.featureDetailsInfo && (
                        <div
                          className={`space-y-2 rounded-lg p-4 ${
                            validationResult.featureDetailsInfo.type === 'missing'
                              ? 'border border-yellow-200 bg-yellow-50'
                              : 'border border-blue-200 bg-blue-50'
                          }`}
                        >
                          <h4
                            className={`font-medium ${
                              validationResult.featureDetailsInfo.type === 'missing'
                                ? 'text-yellow-900'
                                : 'text-blue-900'
                            }`}
                          >
                            {validationResult.featureDetailsInfo.type === 'missing'
                              ? '⚠️ Feature Details Configuration'
                              : '🔗 Feature Details Configuration'}
                          </h4>
                          <p
                            className={`text-sm ${
                              validationResult.featureDetailsInfo.type === 'missing'
                                ? 'text-yellow-800'
                                : 'text-blue-800'
                            }`}
                          >
                            {validationResult.featureDetailsInfo.message}
                          </p>
                          {validationResult.featureDetailsInfo.baseUrl && (
                            <div className="mt-2">
                              <code className="rounded border bg-white px-2 py-1 font-mono text-xs text-gray-800">
                                {validationResult.featureDetailsInfo.baseUrl}/[feature].json
                              </code>
                            </div>
                          )}
                          {validationResult.featureDetailsInfo.sourceSet && (
                            <div className="mt-2">
                              <code className="rounded border bg-white px-2 py-1 font-mono text-xs text-gray-800">
                                memicos_source_set: {validationResult.featureDetailsInfo.sourceSet}
                              </code>
                              <br />
                              <a
                                href={`https://memicos.org/${validationResult.summary?.scan}/${validationResult.featureDetailsInfo.sourceSet}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 px-2 text-xs text-sky-700 underline hover:text-sky-800"
                              >
                                View on MemicOS
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {validationResult.suggestions && validationResult.suggestions.length > 0 && (
                        <div className="space-y-2 rounded-lg bg-blue-50 p-4">
                          <h4 className="flex items-center gap-2 font-medium text-blue-900">
                            <Lightbulb className="h-4 w-4" />
                            Suggested Optional Fields
                          </h4>
                          <p className="mb-2 text-xs text-blue-700">
                            Not required, but provides useful info to display and can also add functionality.
                          </p>
                          <ul className="space-y-1 text-sm text-blue-800">
                            {validationResult.suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="rounded border-l-4 border-blue-300 bg-white p-2 font-mono text-xs"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-col justify-start text-sm">
                        <div className="mb-2 text-xs">
                          Click this button to upload the graph. Note that only specific models/scans are supported
                          right now.
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

        {/* Schema Reference for Graph */}
        <Card className="mb-6 mt-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Attribution Graph Schema Reference
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

      {/* Feature Details Validator */}
      <div className="mb-6">
        <h2 id="feature-validator" className="mb-6 text-2xl font-semibold" style={{ scrollMarginTop: '64px' }}>
          Feature Details Validator
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Feature Details Input
              </CardTitle>
              <CardDescription>Enter your JSON data for validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* JSON Input Section */}
              <div>
                <Label htmlFor="feature-json-input">JSON Data</Label>
                <ReactTextareaAutosize
                  id="feature-json-input"
                  value={featureJsonInput}
                  onChange={(e) => setFeatureJsonInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="max-h-[400px] min-h-[200px] w-full resize-none rounded-md border p-3 font-mono text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minRows={12}
                  maxRows={12}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={validateFeatureJson}
                  disabled={!featureJsonInput.trim() || isValidatingFeature}
                  className="flex-1 sm:flex-none"
                >
                  {isValidatingFeature ? 'Validating...' : 'Validate JSON'}
                </Button>
                <Button variant="outline" onClick={loadSampleFeatureJson} className="flex-1 sm:flex-none">
                  Load Sample
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFeatureJsonInput('');
                    setFeatureValidationResult(null);
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
                {featureValidationResult?.isValid === true && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {featureValidationResult?.isValid === false && <AlertCircle className="h-5 w-5 text-red-500" />}
                JSON Validation Results
              </CardTitle>
              <CardDescription>
                {featureValidationResult ? 'JSON validation complete' : 'No JSON validation performed yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {featureValidationResult ? (
                <div className="space-y-4">
                  {featureValidationResult.isValid ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Valid JSON Schema!</span>
                      </div>

                      {featureValidationResult.summary && (
                        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                          <h4 className="font-medium text-gray-900">Feature Summary</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {featureValidationResult.summary.layer !== undefined && (
                              <div>
                                <span className="font-medium">Layer:</span> {featureValidationResult.summary.layer}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Index:</span> {featureValidationResult.summary.index}
                            </div>
                            <div>
                              <span className="font-medium">Quantiles:</span>{' '}
                              {featureValidationResult.summary.quantilesCount}
                            </div>
                            <div>
                              <span className="font-medium">Examples:</span>{' '}
                              {featureValidationResult.summary.examplesCount}
                            </div>
                            <div>
                              <span className="font-medium">Top Logits:</span>{' '}
                              {featureValidationResult.summary.topLogitsCount}
                            </div>
                            <div>
                              <span className="font-medium">Bottom Logits:</span>{' '}
                              {featureValidationResult.summary.bottomLogitsCount}
                            </div>
                          </div>
                        </div>
                      )}

                      {featureValidationResult.suggestions && featureValidationResult.suggestions.length > 0 && (
                        <div className="space-y-2 rounded-lg bg-blue-50 p-4">
                          <h4 className="flex items-center gap-2 font-medium text-blue-900">
                            <Lightbulb className="h-4 w-4" />
                            Suggested Optional Fields
                          </h4>
                          <p className="mb-2 text-xs text-blue-700">
                            Not required, but could provide additional useful information.
                          </p>
                          <ul className="space-y-1 text-sm text-blue-800">
                            {featureValidationResult.suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="rounded border-l-4 border-blue-300 bg-white p-2 font-mono text-xs"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">JSON Schema Validation Failed</span>
                      </div>

                      <div className="rounded-lg bg-red-50 p-4">
                        <h4 className="mb-2 font-medium text-red-900">JSON Errors Found:</h4>
                        <ul className="space-y-1 text-sm text-red-800">
                          {featureValidationResult.errors.map((error, index) => (
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

        {/* Schema Reference for Feature Details */}
        <Card className="mb-6 mt-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Feature Details Schema Reference
              <Button variant="outline" size="sm" onClick={copyFeatureSchema}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Schema
              </Button>
            </CardTitle>
            <CardDescription>The JSON schema that your feature details must conform to</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg bg-gray-50 p-4 text-xs">
              {JSON.stringify(FEATURE_DETAILS_SCHEMA, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
