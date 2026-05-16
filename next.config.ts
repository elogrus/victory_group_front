import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js", // <-- Обязательно: говорим Turbopack, что результат - JS
            },
        },
    },
    // Важно: Эта конфигурация нужна для продакшн-сборки (next build)
    // и для режима без турбо (next dev --no-turbo)
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },

    async redirects() {
        return [
            // {
            //     source: "/d/team",
            //     destination: "/d",
            //     permanent: true,
            // },
            // {
            //     source: "/d/team/:teamId",
            //     destination: "/d/team/:teamId/members",
            //     permanent: true,
            // },
        ];
    },
};

export default nextConfig;
