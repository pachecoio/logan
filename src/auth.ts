import jwt from 'jsonwebtoken';

export async function generate(user: any) {
  try {
    const today = new Date();
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        data: user,
        exp: new Date(today.setMonth(today.getMonth() + 1)).getTime(),
      },
      // @ts-ignore
      secret
    );
    if (!token) {
      return {
        error: true,
        message: 'Error generating token, try again.',
      };
    }
    return {
      error: false,
      message: 'token generated successfully',
      token,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
    };
  }
}

export async function verify(headers: { authorization: string }) {
  if (!headers || !headers.authorization)
    return {
      error: true,
      valid: false,
      message: 'You must be logged in to access this endpoint',
    };

  try {
    const token = headers.authorization.replace('Bearer ', '');

    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded)
      return {
        error: true,
        valid: false,
        message: 'Invalid token',
      };

    const now = new Date().getTime();
    // @ts-ignore
    if (now > decoded.exp)
      return {
        error: true,
        valid: false,
        message: 'Token expired',
      };
    return {
      error: false,
      valid: true,
      message: 'Token validated successfully',
    };
  } catch (err) {
    return {
      error: true,
      valid: false,
      ...err,
    };
  }
}
