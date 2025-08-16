module.exports = {

"[project]/.next-internal/server/app/api/threats/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/threats/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
// Threat types and severities
const THREAT_TYPES = [
    'phishing',
    'malware',
    'suspicious_activity',
    'fake_profile',
    'harassment',
    'spam',
    'impersonation',
    'data_breach',
    'account_takeover'
];
const SEVERITY_LEVELS = [
    'low',
    'medium',
    'high',
    'critical'
];
const STATUSES = [
    'detected',
    'investigating',
    'blocked',
    'resolved',
    'false_positive'
];
const ACTIONS = [
    'blocked',
    'reported',
    'ignored',
    'monitored'
];
// Simulated threat detection logic
function generateMockThreat(userId, socialAccountId) {
    const threatTypes = THREAT_TYPES.filter((type)=>{
        // Filter based on subscription tier (simplified logic)
        return Math.random() > 0.3 // 70% chance for any threat type
        ;
    });
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const severity = SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)];
    const descriptions = {
        phishing: [
            'Suspicious link detected in direct message',
            'Fake login page attempting to steal credentials',
            'Phishing email targeting account credentials'
        ],
        malware: [
            'Malicious file attachment detected',
            'Suspicious download link identified',
            'Potential malware in shared content'
        ],
        suspicious_activity: [
            'Unusual login attempt from new location',
            'Multiple failed login attempts detected',
            'Suspicious account behavior pattern'
        ],
        fake_profile: [
            'Fake profile impersonating user',
            'Bot account detected following user',
            'Suspicious account creation pattern'
        ],
        harassment: [
            'Harassing messages detected',
            'Bullying content identified',
            'Threatening language in comments'
        ],
        spam: [
            'Spam messages detected in inbox',
            'Unsolicited promotional content',
            'Mass messaging pattern identified'
        ],
        impersonation: [
            'Account impersonating user detected',
            'Fake profile using user\'s identity',
            'Impersonation attempt blocked'
        ],
        data_breach: [
            'Potential data breach detected',
            'Unusual data access pattern',
            'Suspicious data export activity'
        ],
        account_takeover: [
            'Account takeover attempt detected',
            'Unauthorized access attempt',
            'Suspicious password change request'
        ]
    };
    const typeDescriptions = descriptions[type] || [
        'Suspicious activity detected'
    ];
    const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    return {
        userId,
        socialAccountId,
        type,
        severity,
        description,
        status: 'detected',
        confidence: Math.random() * 0.4 + 0.6,
        metadata: JSON.stringify({
            detectionMethod: 'ai_analysis',
            riskScore: Math.floor(Math.random() * 100),
            indicators: generateMockIndicators(type)
        })
    };
}
function generateMockIndicators(type) {
    const indicators = {
        phishing: [
            'suspicious_link',
            'fake_domain',
            'credential_theft'
        ],
        malware: [
            'file_attachment',
            'download_link',
            'executable'
        ],
        suspicious_activity: [
            'unusual_location',
            'failed_attempts',
            'timing_pattern'
        ],
        fake_profile: [
            'profile_similarity',
            'creation_pattern',
            'behavior_analysis'
        ],
        harassment: [
            'toxic_language',
            'threat_keywords',
            'report_frequency'
        ],
        spam: [
            'mass_messaging',
            'promotional_content',
            'unsolicited_contact'
        ],
        impersonation: [
            'profile_copy',
            'identity_theft',
            'name_similarity'
        ],
        data_breach: [
            'data_access',
            'export_activity',
            'unusual_queries'
        ],
        account_takeover: [
            'password_attempt',
            'session_hijack',
            'unauthorized_device'
        ]
    };
    return indicators[type] || [
        'suspicious_activity'
    ];
}
async function GET(request) {
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
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const severity = searchParams.get('severity');
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        // Build where clause
        const where = {
            userId: user.id
        };
        if (severity) where.severity = severity;
        if (status) where.status = status;
        if (type) where.type = type;
        // Get threats
        const threats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.findMany({
            where,
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
        // Get threat counts for statistics
        const totalThreats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.count({
            where: {
                userId: user.id
            }
        });
        const activeThreats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.count({
            where: {
                userId: user.id,
                status: {
                    in: [
                        'detected',
                        'investigating'
                    ]
                }
            }
        });
        const blockedThreats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].threat.count({
            where: {
                userId: user.id,
                status: 'blocked'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            threats,
            statistics: {
                total: totalThreats,
                active: activeThreats,
                blocked: blockedThreats,
                resolved: totalThreats - activeThreats - blockedThreats
            }
        });
    } catch (error) {
        console.error('Threat retrieval error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
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
        const { socialAccountId, type, severity, description, source, confidence, metadata } = await request.json();
        // Validate input
        if (!type || !severity || !description) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Type, severity, and description are required'
            }, {
                status: 400
            });
        }
        if (!THREAT_TYPES.includes(type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid threat type'
            }, {
                status: 400
            });
        }
        if (!SEVERITY_LEVELS.includes(severity)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid severity level'
            }, {
                status: 400
            });
        }
        // Create threat
        const threat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].createThreat({
            userId: user.id,
            socialAccountId,
            type,
            severity,
            description,
            source,
            confidence,
            metadata: metadata ? JSON.stringify(metadata) : undefined
        });
        // Log analytics event
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].logAnalytics({
                userId: user.id,
                eventType: 'threat_detected',
                eventData: JSON.stringify({
                    type,
                    severity,
                    source,
                    socialAccountId
                }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Threat recorded successfully',
            threat
        });
    } catch (error) {
        console.error('Threat creation error:', error);
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
        const { socialAccountId } = await request.json();
        // Get user's social accounts
        const socialAccounts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].getUserSocialAccounts(user.id);
        if (socialAccounts.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No social accounts found for threat scanning'
            }, {
                status: 404
            });
        }
        // Simulate threat detection
        const detectedThreats = [];
        const accountsToScan = socialAccountId ? socialAccounts.filter((acc)=>acc.id === socialAccountId) : socialAccounts;
        for (const account of accountsToScan){
            // Simulate finding 0-2 threats per account
            const threatCount = Math.floor(Math.random() * 3);
            for(let i = 0; i < threatCount; i++){
                const threatData = generateMockThreat(user.id, account.id);
                const threat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].createThreat(threatData);
                detectedThreats.push(threat);
            }
            // Update account threat count
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].socialAccount.update({
                where: {
                    id: account.id
                },
                data: {
                    threatCount: account.threatCount + threatCount,
                    lastScanned: new Date()
                }
            });
        }
        // Log analytics event
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUtils"].logAnalytics({
                userId: user.id,
                eventType: 'threat_scan_completed',
                eventData: JSON.stringify({
                    accountsScanned: accountsToScan.length,
                    threatsDetected: detectedThreats.length
                }),
                ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown'
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Threat scan completed',
            threatsDetected: detectedThreats.length,
            threats: detectedThreats
        });
    } catch (error) {
        console.error('Threat scanning error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__f03596f7._.js.map