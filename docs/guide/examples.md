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

现在通过重新配置自定义的路由，URL `http://mysite.com/list/123` 用户友好的被重写为由`list.html` 控制器处理的
URL `http://mysite.com/list.html?arg=123`

```nginx
rewrite ^/list/(.*)$ /list.html?arg=$1 last;
```

## 修复失败图片路径

在迁移项目时会出现一些图片不在原来的图片位置。比如访问URL `http://mysite.com/uploads/images/example.png`
图片`example.png` 实际所在路径是 `/uploads/example.png`，此时可以通过 `rewrite` 对路径进行重写：

```nginx
rewrite ^/uploads/images/(.*)$ /uploads/$1 last;
```

这样配置后，在访问 `http://mysite.com/uploads/images/exmaple.png` 也能访问 `/uploads/example.png` 文件。

## 图片缺失时使用默认图片

当一些原因导致图片无法访问，可以临时使用一张默认图片作为展示。

比如文章封面或文章内容图，`https://mysite.com/storage/uploads/images/xx.png`
或者 `https://mysite.com/storage/posts/cover/images/xx.png` 无法访问，当出现上面的图片地址无法访问时展示一张默认的图片。

可以使用 nginx 提供的 [`try_files` 指令](http://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)

**注意：默认图片必须可以访问。**

```nginx
# 假定默认的图片存放在项目 /images/default.jpg
location ~* ^\/storage\/(uploads|posts\/cover)\/images.*\.(png|gif|jpg|jpeg)$ { # 正则匹配url前缀
       root /var/www/codes/{PROJECT_NAME}; # 这里编写项目根目录
       try_files $uri /images/default.jpg; # 这里提供默认文件
}
location = /images/default.jpg {
    expires max;
}
```

## 允许部分IP访问，其它IP则301跳转

在站点需要跳转到其它站点时，Nginx可以指定部分IP不跳转，可以通过下面的配置实现：

:::code-group

```nginx [单个IP]
# 当 IP 不等于 `127.0.0.1` 时就跳转到其它域名
location / {
    if ($remote_addr !~ 127.0.0.1) {
        return 301 https://redirect_domain;
    }
}
```

```nginx [多个IP]
# 当 IP 不等于 `127.0.0.1` 或 `192.168.1.1` 时就跳转到其它域名
location / {
    if ($remote_addr !~ (127.0.0.1|192.168.1.1)) {
        return 301 https://redirect_domain;
    }
}
```
:::

> `$remote_addr` 指的是客户端的 IP 地址，如果上层使用了负载均衡可以尝试获取 `$http_x_forwarded_for` 的值 

## 添加用户名和密码HTTP验证

在 Nginx 设置 HTTP 认证需要使用 [httpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html) 来创建和生成加密的用户用于基础认证。

1. 下载工具

    生成对应的用户名和密码信息前需要先下载 httpasswd 工具，针对不同的操作系统下载的软件包不同。
   
    ```bash
    sudo yum -y install httpd-tools # CentOS

    sudo apt-get install apache2-utils # Ubuntu
    ```
2. 创建用户名和密码
   在 nginx 提供服务的网站目录下创建一个 `.htpasswd` 文件。以下命令将创建该文件并向其中添加用户和加密密码。

    ```bash
    sudo htpasswd -c /etc/nginx/.htpasswd exampleuser
    ```

   运行命令后会提示输入密码 `New password: Re-type new password: Adding password for user exampleuser`。

   htpasswd 文件的结构如下：

   ```text
   exampleuser:hased-passwd
   ```
 
   > 请注意，运行 Nginx 的用户需要对生成的文件拥有可读权限。

3. 更新 Nginx 配置

   在网站配置文件中的 `Server` 段添加下面两行：

   ```txt
   server {
      auth_basic "Restricted";
      auth_basic_user_file /etc/nginx/.htpasswd;
      # ...
   }
   ```

4. 重载 Nginx

   ```bash
   nginx -s reload
   ```


现在尝试访问网站或已保护的域路径，可以看到浏览器提示要求输入登录名和密码。

此时输入在创建 `.htpasswd` 文件时提供的用户名和密码信息，并且在入正确的凭据之前，提示不允许访问该网站。

## 多个域名跨域支持

比如当前域名支持 `sub1.domain.com` 和 `sub2.domain.com` 的跨域请求支持，可以在 Nginx 配置文件中通过匹配 `$http_origin` 的值给定：

```
# 允许代理域名访问当前域名下的静态资源的跨域支持
location / {
    if ($http_origin ~* (https?://(?:.+\.)?(sub1\.domain\.com|sub2\.domain\.com)$)) {
        add_header 'Access-Control-Allow-Origin' '$http_origin';
    }
}
```