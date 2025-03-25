import { Box, Tabs } from '@radix-ui/themes';
import Quiz from '../modules/quiz';
import Manage from '../modules/manage';

export default function IndexPage() {
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
}
