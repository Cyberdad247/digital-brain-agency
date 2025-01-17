import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  INodeExecutionData,
  NodeConnectionType,
} from 'n8n-workflow';

export class AgencyWorkflow implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Agency Workflow',
    name: 'agencyWorkflow',
    icon: 'fa:building',
    group: ['transform'],
    version: 1,
    description: 'Integrates with agency management systems',
    defaults: {
      name: 'Agency Workflow',
      color: '#1A82e2',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Create Agent',
            value: 'createAgent',
            description: 'Create a new agent in the system',
          },
          {
            name: 'Update Agent',
            value: 'updateAgent',
            description: 'Update an existing agent',
          },
          {
            name: 'Get Agent',
            value: 'getAgent',
            description: 'Retrieve agent details',
          },
        ],
        default: 'createAgent',
        required: true,
      },
      {
        displayName: 'Agent Name',
        name: 'agentName',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['createAgent', 'updateAgent'],
          },
        },
        default: '',
        required: true,
      },
      {
        displayName: 'Department',
        name: 'department',
        type: 'options',
        options: [
          { name: 'Client Management', value: 'client_management' },
          { name: 'Creative Content', value: 'creative_content' },
          { name: 'Digital Marketing', value: 'digital_marketing' },
          { name: 'Technical Analytics', value: 'technical_analytics' },
          { name: 'Project Management', value: 'project_management' },
        ],
        displayOptions: {
          show: {
            operation: ['createAgent', 'updateAgent'],
          },
        },
        default: 'client_management',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      
      const responseData = {
        operation,
        status: 'success',
        timestamp: new Date().toISOString(),
      };

      returnData.push({
        json: responseData,
      });
    }

    return this.prepareOutputData(returnData);
  }
}
