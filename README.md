# Simple-Uploader

シンプルなアップロードサイトを用意します。

## 🚀 特徴

- 複数ファイルアップロード対応
- ファイルの削除機能
- ファイルのダウンロード対応

## 📂 インストール方法

### 1. **リポジトリのクローン**

```sh
git clone https://github.com/tsuutar/simple-uploader.git
cd simple-uploader
```

### 2. **依存関係のインストール**

```sh
npm install
```

### 3. **サーバーの起動**

```sh
node server.js
```

**または** Nodemon を使用する場合:

```sh
npm install -g nodemon
nodemon server.js
```

### 4. **ブラウザでアクセス**

```
http://localhost:3000
```

## 利用方法

- ファイルのドラッグ＆ドロップより登録可能。ファイルは uploadfiles に保存されます。
- ファイル一覧からダウンロード、削除可能
- シンプルな作りのため、uploadfiles にあるファイルは全て表示されます

## 🏗 ディレクトリ構成

```
file-upload-system/
├── public/
│   ├── index.html  # フロントエンド（UI）
│   ├── script.js   # クライアントサイドのロジック
│   ├── style.css   # スタイル（TailwindCSS使用）
├── uploadfiles/    # アップロードされたファイルが保存されるディレクトリ
├── server.js       # サーバー側の処理（Express）
├── package.json    # Node.js のパッケージ設定
└── README.md       # 本ファイル
```

## 🛡️ セキュリティ対策

- CORS 設定: `http://localhost:3000` のみ許可(必要に応じて修正)
- ファイル名のサニタイズ
- パスインジェクション防止

## ⚖️ ライセンス

MIT License
