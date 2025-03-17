import type { ReactElement } from 'react';
import Layout from '../components/layout';
import type { PageWithLayout } from './_app';
import { Box, Tabs } from '@radix-ui/themes';
import Quiz from '../modules/quiz';
import Manage from '../modules/manage';

const Page: PageWithLayout = () => {
  return (
    <div>
      <Tabs.Root defaultValue="quiz">
        <Tabs.List>
          <Tabs.Trigger value="quiz">Quiz</Tabs.Trigger>
          <Tabs.Trigger value="manage">Manage</Tabs.Trigger>
        </Tabs.List>
        <Box pt="3">
          <Tabs.Content value="quiz">
            <Quiz />
          </Tabs.Content>
          <Tabs.Content value="manage">
            <Manage />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
