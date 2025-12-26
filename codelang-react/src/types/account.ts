export interface Statistic {
  snippetsCount: number
  rating: number
  commentsCount: number
  likesCount: number
  dislikesCount: number
  questionsCount: number
  correctAnswersCount: number
  regularAnswersCount: number
}

export interface User {
  id: number
  username: string
  role: 'user' | 'admin'
}

export interface UserWithStatistic extends User {
  statistic: Statistic
}
