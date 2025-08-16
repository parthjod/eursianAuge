module.exports = {

"[project]/.next-internal/server/app/api/auth/login/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/app/api/auth/login/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { email, password } = await request.json();
        // Validate input
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Email and password are required'
            }, {
                status: 400
            });
        }
        // Find user by email
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                email
            }
        });
        if (!user || !user.password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        // Verify password
        const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
        if (!isPasswordValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        // Log analytics event
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].logAnalytics({
                userId: user.id,
                eventType: 'login',
                eventData: JSON.stringify({
                    method: 'email'
                }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }
        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        // Create response with session cookie
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Login successful',
            user: userWithoutPassword
        });
        // Set session cookie
        response.cookies.set('session', JSON.stringify(userWithoutPassword), {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__bf347238._.js.map