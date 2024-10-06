const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    circlePublisherIndices: [],
    currentIndex: 0,
    internval: undefined,
  },
  auction: {
    auctions: [],
  },
  flow: {
    config: {
      box: { width: 125, height: 100 },
      smallBox: { width: 80, height: 50 },
      mediumBox: { width: 125, height: 50 },
      lineWidth: 100,
      lineHeight: 50,
    },
    intervals: {},
  },
  utils: {},
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined
  },
  canDrawAuctionFlow: true,
}

export default app;