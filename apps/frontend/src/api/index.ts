export const getSid = async (token: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Api Error');
  }

  return (await response.json()) as { sid: string };
};
