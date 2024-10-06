const config = {
    canvas: {
      width: 700,
      background: 245,
    },
    timeline: {
      position: {x: 160, y: 0},
      circleProps: {
        diameter: 50,
        verticalSpacing: 50,
      },
      stepDelay: 1500,
      user: {
        width: 30,
        height: 30,
      },
      circles: [
        { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
        { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
        { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
        { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
        { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
        { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
        { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
        { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
      ],
    },
  };

export default config;