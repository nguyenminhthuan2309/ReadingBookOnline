import * as crypto from 'crypto';

export const MomoConfig = {
  partnerCode: 'MOMOX7ZW20220322',
  accessKey: 'bzSgjHNtsL8SZxqr',
  secretkey: 'TD2PwNHAY6KlXBNn2gu4HKH7PbVxuFdO',
  redirectUrl: 'http://localhost:3001/kiem-tra-thanh-toan',
  ipnUrl:
    'https://6386-2402-800-62a9-e244-49ed-f8bf-2ec1-deda.ngrok-free.app/transaction/momo/webhook',
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
};
