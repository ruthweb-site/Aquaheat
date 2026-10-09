"use strict";
/**
 * AquaHeat — Health Check Probe Lambda Function (Runtime Distribution)
 * Phase 3 AWS SAM Infrastructure Foundation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;

const handler = async () => {
    const payload = {
        service: 'AquaHeat',
        status: 'ok',
    };
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
        },
        body: JSON.stringify(payload),
    };
};
exports.handler = handler;
