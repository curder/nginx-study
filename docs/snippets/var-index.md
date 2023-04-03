Nginx 支持的 http 变量实现在 [ngx_http_variables.c](https://github.com/nginx/nginx/blob/master/src/http/ngx_http_variables.c#L164) 的 `ngx_http_core_variables` 存储实现。

| 变量名                   | 简单说明                                                      |
|-----------------------|-----------------------------------------------------------|
| `$arg_PARAMETER`      | 这个变量包含GET请求中，如果有变量 PARAMETER 时的值                          |
| `$args`               | 这个变量等于请求行中的参数，同 `$query_string`                           |
| `$binary_remote_addr` | 二进制的客户地址                                                  |
| `$body_bytes_sent`    | 响应时送出的body字节数数量。即使连接中断，这个数据也是精确的                          |
| `$content_length`     | 请求头中的 `Content-length` 字段。                                |
| `$content_type`       | 请求头中的 `Content-Type` 字段。                                  |
| `$cookie_COOKIE`      | cookie COOKIE变量的值                                         |
| `$document_root`      | 当前请求在 root 指令中指定的值。                                       |
| `$host`               | 请求主机头字段，否则为服务器名称。                                         |
| `$http_user_agent`    | 客户端 agent 信息                                              |
| `$http_cookie`        | 客户端 cookie 信息                                             |
| `$limit_rate`         | 这个变量可以限制连接速率。                                             |
| `$request_body_file`  | 客户端请求主体信息的临时文件名                                           |
| `$request_method`     | 客户端请求的动作，通常为 GET 或 POST 。                                 |
| `$remote_addr`        | 客户端的 IP 地址，如果上层使用了负载均衡可以尝试获取 `$http_x_forwarded_for` 的值 |
| `$remote_port`        | 客户端的端口。                                                   |
| `$remote_user`        | 已经经过Auth Basic Module验证的用户名。                              |
| `$request_completion` | 如果请求结束，设置为OK。当请求未结束或如果该请求不是请求链串的最后一个时为空                   |
| `$request_filename`   | 当前请求的文件路径，由 root 或 alias 指令与URI请求生成。                      |
| `$scheme`             | HTTP方法（如http，https）。                                      |
| `$server_protocol`    | 请求使用的协议，通常是HTTP/1.0或HTTP/1.1。                             |
| `$server_addr`        | 服务器地址，在完成一次系统调用后可以确定这个值。                                  |
| `$server_name`        | 服务器名称。                                                    |
| `$server_port`        | 请求到达服务器的端口号。                                              |
| `$request_uri`        | 包含请求参数的原始URI，不包含主机名，如：`/foo/bar.php?arg=baz`。             |
| `$uri`                | 不带请求参数的当前URI，`$uri`不包含主机名，如 `/foo/bar.html`。              |
| `$document_uri`       | 与 `$uri` 相同。                                              |
