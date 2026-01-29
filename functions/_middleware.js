// Cloudflare Functions Middleware for Basic Authentication
// すべてのリクエストを傍受してBasic認証を強制します

// セキュリティヘッダーをすべてのレスポンスに追加
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

/**
 * Basic認証の認証情報を検証する
 * @param {string} authHeader - Authorizationヘッダーの値
 * @param {Object} env - 環境変数（AUTH_USERNAMEとAUTH_PASSWORD）
 * @returns {boolean} - 認証情報が有効な場合はtrue
 */
function isValidCredentials(authHeader, env) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Base64エンコードされた認証情報を抽出
  const base64Credentials = authHeader.substring(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  // 環境変数と比較
  const validUsername = env.AUTH_USERNAME || env.USERNAME;
  const validPassword = env.AUTH_PASSWORD || env.PASSWORD;

  // 定数時間比較でタイミング攻撃を防ぐ
  const usernameMatch = username === validUsername;
  const passwordMatch = password === validPassword;

  return usernameMatch && passwordMatch;
}

/**
 * 401 Unauthorizedレスポンスを作成
 * @returns {Response} - 認証プロンプトを含む401レスポンス
 */
function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8"',
      ...SECURITY_HEADERS,
    },
  });
}

/**
 * すべてのリクエストで実行されるミドルウェア関数
 * @param {Object} context - Cloudflare Pagesのコンテキスト
 * @returns {Response} - 401レスポンスまたは次のハンドラーへ渡す
 */
export async function onRequest(context) {
  const { request, env, next } = context;

  // 必要に応じて、特定のパスを認証から除外できます
  // const url = new URL(request.url);
  // const PUBLIC_PATHS = []; // 例: '/health' などの公開パスを追加
  //
  // if (PUBLIC_PATHS.includes(url.pathname)) {
  //   return next();
  // }

  // Authorizationヘッダーを確認
  const authHeader = request.headers.get('Authorization');

  if (!isValidCredentials(authHeader, env)) {
    return unauthorizedResponse();
  }

  // 認証成功 - 静的アセットへ渡す
  const response = await next();

  // レスポンスにセキュリティヘッダーを追加
  const newHeaders = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
