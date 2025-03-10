// This file is auto-generated by @hey-api/openapi-ts

export const $Chat = {
    properties: {
        user_id: {
            type: 'string',
            title: 'User Id'
        },
        chat_id: {
            type: 'string',
            title: 'Chat Id'
        },
        messages: {
            items: {
                '$ref': '#/components/schemas/ChatMessage'
            },
            type: 'array',
            title: 'Messages'
        }
    },
    type: 'object',
    required: ['user_id', 'chat_id', 'messages'],
    title: 'Chat'
} as const;

export const $ChatMessage = {
    properties: {
        content: {
            type: 'string',
            title: 'Content'
        },
        role: {
            type: 'string',
            title: 'Role'
        },
        id: {
            type: 'string',
            title: 'Id'
        },
        timestamp: {
            anyOf: [
                {
                    type: 'string',
                    format: 'date-time'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Timestamp'
        }
    },
    type: 'object',
    required: ['content', 'role', 'id'],
    title: 'ChatMessage'
} as const;

export const $HTTPValidationError = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const $ValidationError = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;