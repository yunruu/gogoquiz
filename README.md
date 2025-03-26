# Gogoquiz
A simple and intuitive platform to make and take quizzes.


## Getting started

### Access

You can directly use the deployed app [here](https://gogoquiz.vercel.app/)!

Alternatively, you can also run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Sample

Feel free to import the sample quizzes we have to familiarise yourself with the user interface.
1. Download the sample json file in our repository, under mock > quizzes.json
2. In the web app, go to **Manage** tab, click on the hamburger icon, and click **Import**. Find the sample json file and import it.

## Data storage

Data is stored in your browser's local storage. To save your quizzes, simply export them to your device:
1. Go to **Manage** tab
2. Click on the hamburger icon
3. Select **Export**
4. A timestamped quiz json file will be saved to your device

You can then import the json file to retrieve the quizzes.

Be warned: if you clear your browser's local storage (associated with this app), all quiz data stored on it will be gone. So try to export your data to your device periodically, or at least before you clear the local storage.

Happy quizzing~ 💖
