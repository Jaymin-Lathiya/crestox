export const myPortfolioURLS = {
  MY_PORTFOLIO: (artistProfileId: number) =>
    `/artwork/artist/${artistProfileId}/my-portfolio`,
  PORTFOLIO_DASHBOARD: "/artists/me/portfolio-dashboard",
  PORTFOLIO_ANALYTICS: "/artists/me/portfolio-analytics",
  MY_ARTIST_PROFILE: "/artists/me/profile",
  MY_ARTIST_ACHIEVEMENTS: "/artists/me/achievements",
  MY_ARTIST_ACHIEVEMENT: (achievementId: number) =>
    `/artists/me/achievements/${achievementId}`,
};
