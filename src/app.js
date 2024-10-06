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