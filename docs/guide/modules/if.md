# if 条件判断

当需要判断文件不存在时、对不同的客户端IP执行不同的响应或请求路径符合某些条件时执行不同的逻辑，此时会需要用到 if 指令。

if 能在 server 或 location 段中使用，它的语法为：

```
if (condition) { 
    # ...
}
```

## if 条件

其中 condition 条件语法可以包括如下：

- **文件及目录匹配**

    - 使用 `=` 或者 `!=` 直接比较变量内容，**注意不是 `==`**
    - 使用 `-f` 和 `!-f` 判断文件是否存在
    - 使用 `-d` 和 `!-d` 判断目录是否存在
    - 使用 `-e` 和 `!-e` 判断文件或目录是否存在
    - 使用 `-x` 和 `!-x` 用来判断文件是否可执行

- **正则匹配**

    - `~` 区分大小写匹配指定正则表达式，当匹配时返回"真"
    - `~*` 不区分大小写匹配指定正则表达式，当匹配时返回"真"
    - `!~` 区分大小写匹配指定正则表达式，当不匹配时候返回"真"
    - `!~*` 不区分大小写匹配指定正则表达式，当不匹配时候返回"真"

并且 if 指令不支持多条件、不支持嵌套且不支持 else。

## if 关键字

### [break](http://nginx.org/r/break)

遇到 `break` 则跳出，后面的指令不在执行，比如：

```
if (!-f $reque_filename) {
    set $id = 1; # 有效的指令
    break;
    limit_rate 10k; # 无效的指令
}
```

### [return](http://nginx.org/r/return)

完成对请求的处理，直接向客户端返回响应状态码。比如：
::: code-group

```nginx [返回状态码和文本]
# 格式如下：
return code [text];

# 示例1：直接返回状态码
return 403;
# 示例2：拒绝没有有效身份验证令牌的请求时
return 401 "Access denied because token is expired or invalid";
```

```nginx [返回状态码和URL]
# 格式如下： 
return code URL;

# 示例：重定向
return 301 $scheme://www.example.com$request_uri;
```

```nginx [返回URL]
# 格式如下：
return URL;

# 示例：重定向
return $scheme://www.example.com$request_uri;
```
:::

参数解释如下：

| 参数   | 描述                 |
|------|--------------------|
| code | 返回给客户端的 HTTP 状态码   |
| URL  | 返回给客户端的 URL 地址     |
| text | 返回给客户端的响应体内容，支持变量。 |

`return` 指令使用简单，适用于重定向满足条件的情况，重写的 URL 适用于匹配 server 或 location 块的每个请求，并且可以使用标准
[NGINX 变量](http://nginx.org/en/docs/varindex.html)构建重写的 URL。

### [rewrite](http://nginx.org/r/rewrite)





### [set](https://nginx.org/r/set)

设置变量，语法如下：

```
set $variable value;
```

为了配置 if 指令的条件判断，需要用到 <!--@include: ../../snippets/var-index.md -->

## 举例

### 如果文件不存在返回 400

```
if (!-f $request_filename) {
    return 400;
}
```

### 如果主机不是 example.com 则跳转到 example.com

```
if ($host != example.com) {
    rewrite ^/(.*)$ https://example.com/$1 permanent;
}
```

### 如果请求类型不是 POST 则返回 405

```
if ($request_method = POST) {
    return 405;
}
```

### 如果请求参数中有 `a=1` 则 `301` 到其他域名

```
if ($args ~ a=1) {
    rewrite ^ http://example.com/ permanent;
}
```

### Nginx 多重条件判断

nginx 的配置中不支持 if 条件的逻辑与／逻辑或运算 ，并且不支持 if 的嵌套语法。

- `or` 或者

  当站点或页面还没有上线，需要仅允许指定 IP 访问整站或特定URI，其他 IP 都返回 405 状态码。

  针对上面的需求，Nginx 可以使用正则表达式，或者使用 set 指定定义变量。

  比如访问者的 IP 是 `8.8.8.8` 或者 `114.114.114.114`时允许访问，其他 IP 访问则返回 405。

  ::: code-group

    ``` 正则表达式
    if ($remote_ip !~ "^(114|8)\.(114|8)\.(114|8)\.(114|8)$") {
        return 405;
    }
    ```

    ``` 定义变量
    set $allow_ip 0;

    if ($remote_addr = 114.114.114.114) {
        set $allow_ip 1;
    }
    if ($remote_addr = 8.8.8.8) {
        set $allow_ip 1;
    }

    if ($allow_ip != 1) {
        return 405;
    }
    ```
  :::

  以上是或者的关系，也就是多个条件中满足其一即可。

- `and` 并且
  :::code-group
  ``` 使用数值类型
  set $and 1;

  if (<not condition>) {
    set $and 0;
  }

  if (<not condition>) {
    set $and 0;
  }

  if ($and) {
    # ...
  }
  ```

  ``` 使用字符串类型
  set $and ""

  if (<condition>) {
      set $and "0";
  }

  if (<condition>) {
      set $and "${and}1";
  }

  if ($and = "01") {
      # ...
  }
  ```
  :::

## 参考

[if 官方文档](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#if)