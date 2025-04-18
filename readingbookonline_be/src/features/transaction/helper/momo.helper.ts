import * as crypto from 'crypto';

export const MomoConfig = {
  partnerCode: 'MOMOX7ZW20220322',
  accessKey: 'bzSgjHNtsL8SZxqr',
  secretkey: 'TD2PwNHAY6KlXBNn2gu4HKH7PbVxuFdO',
  redirectUrl: 'http://localhost:3001/kiem-tra-thanh-toan',
  ipnUrl:
    'https://9ece-2402-800-63a9-cff4-8c88-bd70-2162-52e4.ngrok-free.app/transaction/momo/webhook',
  requestType: 'captureWallet',
  extraData: '',
  lang: 'vi',

  getRawSignature: (
    accessKey: string,
    amount: number,
    extraData: string,
    ipnUrl: string,
    orderId: string,
    orderInfo: string,
    partnerCode: string,
    redirectUrl: string,
    requestId: string,
    requestType: string,
    secretkey: string,
  ): string => {
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    return crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
  },

  getRawcheckSignature: (
    accessKey: string,
    orderId: string,
    partnerCode: string,
    requestId: string,
    secretkey: string,
  ): string => {
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

    return crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
  },
};
