import type { Meta, StoryObj } from '@storybook/react';
import { WishList } from './wish-list';

const meta = {
  title: 'Components/WishList',
  component: WishList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WishList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleWishes = [
  {
    id: '1',
    wish: 'A magical train set that travels to the North Pole',
    category: 'toy' as const,
    priority: 'dream wish' as const,
    timestamp: new Date('2024-12-20T10:30:00').toISOString(),
    granted: false,
  },
  {
    id: '2',
    wish: 'Visit the Northern Lights with my family',
    category: 'experience' as const,
    priority: 'hopeful wish' as const,
    timestamp: new Date('2024-12-21T14:15:00').toISOString(),
    granted: false,
  },
  {
    id: '3',
    wish: 'Help deliver warm blankets to everyone in need',
    category: 'kindness' as const,
    priority: 'small wish' as const,
    timestamp: new Date('2024-12-22T09:45:00').toISOString(),
    granted: false,
  },
  {
    id: '4',
    wish: 'See real magic snowflakes that never melt',
    category: 'magic' as const,
    priority: 'dream wish' as const,
    timestamp: new Date('2024-12-23T16:00:00').toISOString(),
    granted: false,
  },
];

export const EmptyList: Story = {
  args: {
    data: {
      wishes: [],
    },
  },
};

export const SingleWish: Story = {
  args: {
    data: {
      wishes: [sampleWishes[0]],
    },
  },
};

export const MultipleWishes: Story = {
  args: {
    data: {
      wishes: sampleWishes,
    },
  },
};

export const WithGrantedWishes: Story = {
  args: {
    data: {
      wishes: [
        {
          ...sampleWishes[0],
          granted: true,
          grantedAt: new Date('2024-12-24T08:00:00').toISOString(),
        },
        sampleWishes[1],
        {
          ...sampleWishes[2],
          granted: true,
          grantedAt: new Date('2024-12-24T09:30:00').toISOString(),
        },
        sampleWishes[3],
      ],
    },
  },
};

export const AllPriorities: Story = {
  args: {
    data: {
      wishes: [
        {
          id: '1',
          wish: 'Dream wish: Most important wish that glows brightest',
          category: 'magic' as const,
          priority: 'dream wish' as const,
          timestamp: new Date('2024-12-20T10:00:00').toISOString(),
          granted: false,
        },
        {
          id: '2',
          wish: 'Hopeful wish: Medium priority with moderate glow',
          category: 'experience' as const,
          priority: 'hopeful wish' as const,
          timestamp: new Date('2024-12-20T11:00:00').toISOString(),
          granted: false,
        },
        {
          id: '3',
          wish: 'Small wish: Simple wish with gentle glow',
          category: 'kindness' as const,
          priority: 'small wish' as const,
          timestamp: new Date('2024-12-20T12:00:00').toISOString(),
          granted: false,
        },
      ],
    },
  },
};

export const LongList: Story = {
  args: {
    data: {
      wishes: Array.from({ length: 12 }, (_, i) => ({
        id: `wish-${i + 1}`,
        wish: `Wish number ${i + 1}: ${['A magical adventure', 'Something wonderful', 'A kind gesture', 'A special moment'][i % 4]}`,
        category: ['toy', 'experience', 'kindness', 'magic'][i % 4] as
          | 'toy'
          | 'experience'
          | 'kindness'
          | 'magic',
        priority: ['dream wish', 'hopeful wish', 'small wish'][i % 3] as
          | 'dream wish'
          | 'hopeful wish'
          | 'small wish',
        timestamp: new Date(2024, 11, 20 + (i % 4), 10 + i).toISOString(),
        granted: i % 5 === 0,
        grantedAt:
          i % 5 === 0
            ? new Date(2024, 11, 24, 8, i * 5).toISOString()
            : undefined,
      })),
    },
  },
};

export const NoData: Story = {
  args: {},
};
