import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import prisma from '../prisma-connection.ts';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the widget tools for Gemini
const widgetTools = {
  createWidget: {
    description: 'Create a new widget in the database',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'Widget title',
        },
        type: {
          type: SchemaType.STRING,
          enum: ['text', 'graph', 'table'],
          description: 'Widget type',
        },
        filter: {
          type: SchemaType.STRING,
          description: 'Widget filter or configuration',
        },
      },
      required: ['title', 'type'],
    },
  },
  updateWidget: {
    description: 'Update an existing widget',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: {
          type: SchemaType.STRING,
          description: 'Widget ID',
        },
        title: {
          type: SchemaType.STRING,
          description: 'Widget title',
        },
        type: {
          type: SchemaType.STRING,
          enum: ['text', 'graph', 'table'],
          description: 'Widget type',
        },
        filter: {
          type: SchemaType.STRING,
          description: 'Widget filter or configuration',
        },
      },
      required: ['id'],
    },
  },
  deleteWidget: {
    description: 'Delete a widget',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: {
          type: SchemaType.STRING,
          description: 'Widget ID to delete',
        },
      },
      required: ['id'],
    },
  },
  getWidgets: {
    description: 'Get all widgets from the database',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
};

export async function processLLMRequest(userMessage: string): Promise<string> {
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });


       
  const chat = model.startChat({
    tools: [
      {
        functionDeclarations: [
          {
            name: 'createWidget',
            description: widgetTools.createWidget.description,
            parameters: widgetTools.createWidget.parameters,
          },
          {
            name: 'updateWidget',
            description: widgetTools.updateWidget.description,
            parameters: widgetTools.updateWidget.parameters,
          },
          {
            name: 'deleteWidget',
            description: widgetTools.deleteWidget.description,
            parameters: widgetTools.deleteWidget.parameters,
          },
          {
            name: 'getWidgets',
            description: widgetTools.getWidgets.description,
            parameters: widgetTools.getWidgets.parameters,
          },
        ],
      },
    ],
  });

  // Send initial message
  let response = await chat.sendMessage(userMessage);
  const toolCalls = response.response.functionCalls() || [];
  // Agentic loop - keep processing until no more tool calls
  while (toolCalls && toolCalls.length > 0) {
  
    const toolResults: { name: string; result: any }[] = [];

    // Execute all tool calls
    for (const toolCall of toolCalls) {
      const result = await executeWidgetTool(
        toolCall.name,
        toolCall.args as Record<string, any>
      );
      toolResults.push({
        name: toolCall.name,
        result: result,
      });
    }

    // Send tool results back to the model
    const toolResultContent = toolResults.map((tr) => ({
      functionResponse: {
        name: tr.name,
        response: tr.result,
      },
    }));

    response = await chat.sendMessage(toolResultContent);
  }

  // Extract final text response
  const textContent = response.response
    .candidates?.[0]?.content?.parts?.find((part: any) => part.text)?.text;
  return textContent || 'No response generated';
}

async function executeWidgetTool(
  toolName: string,
  input: Record<string, any>
): Promise<any> {
  try {
    switch (toolName) {
      case 'createWidget':
        return await handleCreateWidget(input);
      case 'updateWidget':
        return await handleUpdateWidget(input);
      case 'deleteWidget':
        return await handleDeleteWidget(input);
      case 'getWidgets':
        return await handleGetWidgets();
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function handleCreateWidget(input: Record<string, any>): Promise<any> {
  const { title, type, filter } = input;

  const widget = await prisma.widgets.create({
    data: {
      title,
      type,
      filter: filter || {},
    },
  });

  return {
    success: true,
    message: `Widget "${title}" created successfully`,
    widget,
  };
}

async function handleUpdateWidget(input: Record<string, any>): Promise<any> {
  const { id, title, type, filter } = input;

  const widget = await prisma.widgets.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(type && { type }),
      ...(filter !== undefined && { filter }),
    },
  });

  return {
    success: true,
    message: `Widget updated successfully`,
    widget,
  };
}

async function handleDeleteWidget(input: Record<string, any>): Promise<any> {
  const { id } = input;

  await prisma.widgets.delete({
    where: { id },
  });

  return {
    success: true,
    message: `Widget deleted successfully`,
  };
}

async function handleGetWidgets(): Promise<any> {
  const widgets = await prisma.widgets.findMany();

  return {
    success: true,
    count: widgets.length,
    widgets,
  };
}
