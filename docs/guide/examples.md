# 一些示例

## 添加或删除 `www` 子域名

::: code-group

```nginx [添加 www 子域名]
server {
    listen 80;
    listen 443 ssl;
    server_name domain.com;
    return 301 $scheme://www.domain.com$request_uri;
}

# 不推荐使用 rewrite
rewrite ^(.*)$ $scheme://www.domain.com$1 permanent;
```

```nginx [删除 www 子域名]
server {
    listen 80;
    listen 443 ssl;
    server_name www.domain.com;
    return 301 $scheme://domain.com$request_uri;
}
```

:::

## 强制所有请求使用 SSL/TLS

此 server 块强制所有访问者使用安全 (SSL/TLS) 连接到站点。

```nginx
server {
    listen 80;
    server_name www.domain.com;
    return 301 https://www.domain.com$request_uri;
}

# 不推荐使用 rewrite 重写规则
if ($scheme != "https") {
    rewrite ^ https://www.mydomain.com$uri permanent;
}
```

## 禁止对不支持的文件扩展名的请求

由于各种原因，站点可能会收到以与未运行的应用程序服务器相对应的文件扩展名结尾的请求 URL，而服务器处理的文件类型的请求无法得到服务，需要被拒绝。

```nginx
location ~ .(aspx|php|jsp|cgi)$ {
    return 410;
}
```
它相对于 404 响应代码的优势在于它明确指示资源永久不可用，因此客户端不会再次发送请求。

## 禁止访问站点某些前缀

在站点需要迁移的时候，站点对应的后台不想让用户对数据进行编辑，可以通过配置 Nginx 禁止访问站点的某些域名前缀。

```nginx
location ~* /admin {
    return 403;
}
```

这样配置的话，再访问前缀为 `/admin` 就会返回 **403 Forbidden**；

## 配置自定义重新路由

现在通过重新配置自定义的路由，URL `http://mysite.com/list/123` 用户友好的被重写为由`list.html` 控制器处理的 URL `http://mysite.com/list.html?arg=123`

```nginx
rewrite ^/list/(.*)$ /list.html?arg=$1 last;
```