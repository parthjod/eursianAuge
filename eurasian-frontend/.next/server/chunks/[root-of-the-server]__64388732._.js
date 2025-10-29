module.exports = {

"[project]/.next-internal/server/app/api/threats/update/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/src/lib/db.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "dbUtils": (()=>dbUtils),
    "prisma": (()=>prisma)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const dbUtils = {
    // User operations
    async createUser (data) {
        return await prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },
    async getUserById (id) {
        return await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },
    async getUserByEmail (email) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    },
    // Subscription operations
    async createSubscription (data) {
        return await prisma.subscription.create({
            data: {
                ...data,
                nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
    },
    async getUserSubscription (userId) {
        return await prisma.subscription.findUnique({
            where: {
                userId
            }
        });
    },
    // Threat operations
    async createThreat (data) {
        return await prisma.threat.create({
            data
        });
    },
    async getUserThreats (userId, limit = 50, offset = 0) {
        return await prisma.threat.findMany({
            where: {
                userId
            },
            include: {
                socialAccount: {
                    select: {
                        platform: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: offset
        });
    },
    // Social account operations
    async createSocialAccount (data) {
        return await prisma.socialAccount.create({
            data
        });
    },
    async getUserSocialAccounts (userId) {
        return await prisma.socialAccount.findMany({
            where: {
                userId,
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    // Security metrics operations
    async createSecurityMetric (data) {
        return await prisma.securityMetric.create({
            data: {
                ...data,
                date: data.date || new Date()
            }
        });
    },
    async getUserSecurityMetrics (userId, metricType, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const where = {
            userId,
            date: {
                gte: startDate
            }
        };
        if (metricType) {
            where.metricType = metricType;
        }
        return await prisma.securityMetric.findMany({
            where,
            orderBy: {
                date: 'desc'
            }
        });
    },
    // Analytics operations
    async logAnalytics (data) {
        return await prisma.analytics.create({
            data
        });
    },
    async getUserAnalytics (userId, eventType, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const where = {
            userId,
            createdAt: {
                gte: startDate
            }
        };
        if (eventType) {
            where.eventType = eventType;
        }
        return await prisma.analytics.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    // AI Agent operations
    async createAIAgent (data) {
        return await prisma.aIAgent.create({
            data
        });
    },
    async getUserAIAgents (userId) {
        return await prisma.aIAgent.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    // Feedback operations
    async createFeedback (data) {
        return await prisma.feedback.create({
            data
        });
    },
    async getUserFeedbacks (userId) {
        return await prisma.feedback.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    // Social scan operations
    async createSocialScan (data) {
        return await prisma.socialScan.create({
            data
        });
    },
    async updateSocialScan (id, data) {
        return await prisma.socialScan.update({
            where: {
                id
            },
            data
        });
    }
};
}}),
"[project]/src/app/api/threats/update/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
const VALID_STATUSES = [
    'detected',
    'investigating',
    'blocked',
    'resolved',
    'false_positive'
];
const VALID_ACTIONS = [
    'blocked',
    'reported',
    'ignored',
    'monitored'
];
async function POST(request) {
    try {
        // Get user from session cookie
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie || !sessionCookie.value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Authentication required'
            }, {
                status: 401
            });
        }
        let user;
        try {
            user = JSON.parse(sessionCookie.value);
        } catch (parseError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid session'
            }, {
                status: 401
            });
        }
        const { threatId, status, actionTaken } = await request.json();
        if (!threatId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Threat ID is required'
            }, {
                status: 400
            });
        }
        // Get the threat
        const existingThreat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.findFirst({
            where: {
                id: threatId,
                userId: user.id
            }
        });
        if (!existingThreat) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Threat not found or access denied'
            }, {
                status: 404
            });
        }
        // Validate status and action
        const updateData = {};
        if (status) {
            if (!VALID_STATUSES.includes(status)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid status value'
                }, {
                    status: 400
                });
            }
            updateData.status = status;
        }
        if (actionTaken) {
            if (!VALID_ACTIONS.includes(actionTaken)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invalid action value'
                }, {
                    status: 400
                });
            }
            updateData.actionTaken = actionTaken;
        }
        // Update the threat
        const updatedThreat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.update({
            where: {
                id: threatId
            },
            data: updateData
        });
        // Log analytics event
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].logAnalytics({
                userId: user.id,
                eventType: 'threat_updated',
                eventData: JSON.stringify({
                    threatId,
                    oldStatus: existingThreat.status,
                    newStatus: status || existingThreat.status,
                    actionTaken: actionTaken || existingThreat.actionTaken
                }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Threat updated successfully',
            threat: updatedThreat
        });
    } catch (error) {
        console.error('Threat update error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        // Get user from session cookie
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie || !sessionCookie.value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Authentication required'
            }, {
                status: 401
            });
        }
        let user;
        try {
            user = JSON.parse(sessionCookie.value);
        } catch (parseError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid session'
            }, {
                status: 401
            });
        }
        const { threatIds, status, actionTaken } = await request.json();
        if (!threatIds || !Array.isArray(threatIds) || threatIds.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Threat IDs array is required'
            }, {
                status: 400
            });
        }
        // Validate status and action
        if (status && !VALID_STATUSES.includes(status)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid status value'
            }, {
                status: 400
            });
        }
        if (actionTaken && !VALID_ACTIONS.includes(actionTaken)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid action value'
            }, {
                status: 400
            });
        }
        // Update multiple threats
        const updateData = {};
        if (status) updateData.status = status;
        if (actionTaken) updateData.actionTaken = actionTaken;
        const updateResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.updateMany({
            where: {
                id: {
                    in: threatIds
                },
                userId: user.id
            },
            data: updateData
        });
        // Log analytics event
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].logAnalytics({
                userId: user.id,
                eventType: 'threat_bulk_updated',
                eventData: JSON.stringify({
                    threatCount: threatIds.length,
                    status,
                    actionTaken
                }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: `${updateResult.count} threats updated successfully`,
            updatedCount: updateResult.count
        });
    } catch (error) {
        console.error('Bulk threat update error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__64388732._.js.map