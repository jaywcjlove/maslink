# maslink

`maslink` 是一个很小的静态跳转页，用来把普通的 `https://` 链接转换回 Apple App Store 的原生深链接。

GitHub 的 README 预览通常会移除 `macappstore://` 这类自定义协议，导致 Mac App Store 链接无法直接点击。这个项目提供一个可放在 README 里的 `https://` 中间页，在浏览器打开后再拼接成原生 App Store 链接并跳转。

## 使用场景

不要直接写：

```text
macappstore://itunes.apple.com/app/6758053530
```

改成写：

```text
https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=mac
```

页面打开后会：

1. 读取查询参数。
2. 生成对应的 App Store 深链接。
3. 自动尝试跳转。
4. 同时提供手动打开和网页回退按钮。

## 参数说明

- `id`：苹果应用 ID，只能是数字，必填。
- `l`：Apple 商店地区或语言参数，可选，默认 `us`。
- `platform`：目标平台，可选，默认 `mac`。

支持的 `platform` 值：

- `mac`
- `ios`
- `iphone`
- `ipad`

## 生成规则

macOS 跳转链接：

```text
macappstore://itunes.apple.com/app/id<ID>?mt=12&l=<LOCALE>
```

iOS 跳转链接：

```text
itms-apps://itunes.apple.com/app/id<ID>?l=<LOCALE>
```

网页回退链接：

```text
https://apps.apple.com/<LOCALE>/app/id<ID>
```

## 部署

这个仓库就是一个纯静态页面，适合直接部署到 GitHub Pages。

默认入口文件是 [index.html](/Users/wong/git/github/maslink/index.html)。

## 示例

- macOS： [打开示例](https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=mac)
- iOS： [打开示例](https://jaywcjlove.github.io/maslink/?id=6758053530&l=cn&platform=ios)
