export class Common {
  static formatTime(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  static formatLocaleDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  static formatDate(time: string): string {
    const dateRec = new Date(time);
    const curDate = new Date();
    const year = dateRec.getFullYear();
    const month = dateRec.getMonth();
    const day = dateRec.getDate();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();

    if (day === curDay && month === curMonth && year === curYear) {
      return this.formatTime(dateRec);
    }
    const yesterday = new Date(curDate);
    yesterday.setDate(curDate.getDate() - 1);
    if (
      day === yesterday.getDate() &&
      month === yesterday.getMonth() &&
      year === yesterday.getFullYear()
    ) {
      return `Yesterday ${this.formatTime(dateRec)}`;
    }

    const twoDaysAgo = new Date(curDate);
    twoDaysAgo.setDate(curDate.getDate() - 1);
    if (dateRec < twoDaysAgo) {
      return this.formatLocaleDate(dateRec);
    }
    return '';
  }

  static truncateString(str: string, length: number = 25): string {
    if (str) {
      const endIndex: number = length;
      if (str.length <= endIndex) {
        return str;
      }

      return str.slice(0, endIndex) + '...';
    }
    return '';
  }

  static formatTimeAgo(date: Date): string {
    const dateRec = new Date(date);
    const curDate = new Date();

    if (curDate.getTime() >= dateRec.getTime()) {
      const days = Math.floor(
        (curDate.getTime() - dateRec.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days == 0) {
        const hours = Math.floor(
          (curDate.getTime() - dateRec.getTime()) / (1000 * 60 * 60)
        );
        return `${hours} hours ago`;
      }

      if (days > 0) {
        if (days == 1) {
          return `${days} day ago`;
        } else {
          return `${days} days ago`;
        }
      }
    }

    return '';
  }
}
