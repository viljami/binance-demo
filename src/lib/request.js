import https from 'https';
import crypto from 'crypto';

const keyValuePairToString = ([key, value]) => `${key}=${value}`;
const objectToQuerystring = o => Object
    .entries(o)
    .map(keyValuePairToString)
    .join('&');

export default async (
    method,
    url,
    data,
    apiKey,
    apiSecret
) => {
    const methodUpper = method.toUpperCase();
    let querystring = (methodUpper === 'GET' || methodUpper === 'DELETE') && data ?
        `${objectToQuerystring(data)}` :
        '';

    if (querystring && apiSecret) {
        const hmac = crypto.createHmac('sha256', apiSecret);
        hmac.update(querystring, 'utf8');
        const signature = encodeURIComponent(hmac.digest('hex'));
        querystring = `?${querystring}&signature=${signature}`;
    }

    const fullUrl = `${url}${querystring}`;

    return new Promise((resolve, reject) => {
        const req = https
            .request(fullUrl, {
                method: methodUpper,
                headers: { 'X-MBX-APIKEY': apiKey }
            }, res => {
                res.setEncoding('utf8');

                let rawData = '';

                res.on('data', chunk => rawData += chunk);

                res.on('end', () => {
                    if (!rawData) {
                        return resolve({ status: res.statusCode, data: undefined });
                    }

                    try {
                        resolve({
                            status: res.statusCode,
                            data: JSON.parse(rawData)
                        });
                    } catch (e) {
                        console.error(e.message);
                        reject({
                            error: "Error parsing response body. " + e.message
                        });
                    }
                });

                res.on('error', err => reject({
                    error: `problem with response: ${err.message}`
                }));
            });

        switch (methodUpper) {
            case 'GET':
            case 'DELETE':
                break;
            case 'POST':
            case 'PUT':
                if (data) {
                    req.write(JSON.stringify(data));
                }
                break;
            default:
                reject({ error: `No method ${method}` });
        }

        req.on('error', err => reject({
            error: `Problem with request: ${err.message}`
        }));

        req.end();
    });
};
