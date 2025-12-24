import type { Meta, StoryObj } from '@storybook/react';
import { WishBox } from './wish-box';

const meta = {
  title: 'Components/WishBox',
  component: WishBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WishBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToyWish: Story = {
  args: {
    data: {
      wish: 'A magical train set that travels to the North Pole',
      category: 'toy',
      priority: 'dream wish',
      timestamp: new Date('2024-12-20T10:30:00').toISOString(),
      granted: false,
    },
  },
};

export const ExperienceWish: Story = {
  args: {
    data: {
      wish: 'Visit the Northern Lights with my family',
      category: 'experience',
      priority: 'hopeful wish',
      timestamp: new Date('2024-12-21T14:15:00').toISOString(),
      granted: false,
    },
  },
};

export const KindnessWish: Story = {
  args: {
    data: {
      wish: 'Help deliver warm blankets to everyone in need',
      category: 'kindness',
      priority: 'small wish',
      timestamp: new Date('2024-12-22T09:45:00').toISOString(),
      granted: false,
    },
  },
};

export const MagicWish: Story = {
  args: {
    data: {
      wish: 'See real magic snowflakes that never melt',
      category: 'magic',
      priority: 'dream wish',
      timestamp: new Date('2024-12-23T16:00:00').toISOString(),
      granted: false,
    },
  },
};

export const GrantedWish: Story = {
  args: {
    data: {
      wish: 'A magical train set that travels to the North Pole',
      category: 'toy',
      priority: 'dream wish',
      timestamp: new Date('2024-12-20T10:30:00').toISOString(),
      granted: true,
      grantedAt: new Date('2024-12-24T08:00:00').toISOString(),
    },
  },
};

export const EmptyWish: Story = {
  args: {
    data: {
      category: 'magic',
      priority: 'hopeful wish',
    },
  },
};

export const NoData: Story = {
  args: {},
};
