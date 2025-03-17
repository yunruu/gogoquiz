const APP_KEY = 'myquizmod_storage_key_';

export const writeJson = (key: string, value: unknown) => {
  const data = JSON.stringify(value);
  localStorage.setItem(APP_KEY + key, data);
};

export const readJson = (key: string) => {
  const data = localStorage.getItem(APP_KEY + key);
  return data ? JSON.parse(data) : null;
};
