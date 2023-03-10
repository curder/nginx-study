# Nginx 安装

## MacOS

```bash
# 安装 Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# 安装Nginx
brew install nginx
```

**重要路径:**

- 主机配置文件所在路径：`/usr/local/etc/nginx/servers/`
- 默认主配置文件：`/usr/local/etc/nginx/nginx.conf`
- 日志文件： `/usr/local/var/log/nginx/`
- 默认文档目录： `/usr/local/var/www/`
- 默认监听本地地址： `http://localhost:8080`

> 如果 MacOS 系统为 M1 架构，其中路径前缀为：`/opt/homebrew/`

## CentOS

```bash
# 安装 epel 库
sudo yum -y install epel-release

# 安装 Nginx
sudo yum -y install nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**重要路径:**

- 默认主配置文件：`/etc/nginx/nginx.conf`
- 日志文件： `/etc/nginx/logs/`
- 默认文档目录： `/etc/nginx/html/`
- 默认监听本地地址： `http://localhost`

## Ubuntu

```bash
# 更新系统依赖
apt update

# 安装Nginx
apt install nginx

# 启动Nginx
systemctl start nginx
systemctl enable nginx
```

**重要路径:**

- 主机配置文件所在路径：`/etc/nginx/sites-enabled/`
- 默认主配置文件：`/etc/nginx/nginx.conf`
- 日志文件： `/var/log/nginx/`
- 默认文档目录： `/etc/nginx/html/`
- 默认监听本地地址： `http://localhost`
