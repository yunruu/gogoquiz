const APP_KEY = 'gogoquiz_storage_key_';

export const setItem = (key: string, value: unknown) => {
  const data = JSON.stringify(value);
  localStorage.setItem(APP_KEY + key, data);
};

export const getItem = (key: string) => {
  const data = localStorage.getItem(APP_KEY + key);
  return data ? JSON.parse(data) : null;
};
