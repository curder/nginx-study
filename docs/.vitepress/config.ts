import {defineConfig} from 'vitepress'

export default defineConfig({
    lang: "zh-CN",
    base: "/nginx-study/",
    title: "Nginx 学习",
    description: "Nginx 学习记录",
    lastUpdated: true,
    head: [
        ['link', {rel: 'icon', href: '/nginx/images/favicon.ico'}],
    ],
    themeConfig: {
        logo: "/images/logo.svg",
        siteTitle: "Nginx 学习",
        outline: {
            level: 'deep',
            label: "章节导航",
        },
        // outlineTitle: "章节导航",
        // outline: 'deep',
        lastUpdatedText: "最后更新时间",
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        editLink: {
            pattern: "https://github.com/curder/nginx/edit/master/docs/:path",
            text: '编辑它'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/curder/nginx'}
        ],
        nav: nav(),
        sidebar: {}
    }
});

function nav() {
    return [
        {text: '安装', link: '/guide/install', activeMatch: '/guide/install'},
    ];
}
