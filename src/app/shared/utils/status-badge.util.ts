export function rechargeStatusBadge(status: string): string {
  const map: Record<string, string> = {
    'COMPLETED': 'badge-success',
    'SUCCESS': 'badge-success',
    'PENDING': 'badge-warning',
    'PROCESSING': 'badge-info',
    'FAILED': 'badge-danger'
  };
  return map[status] ?? 'badge-gray';
}

export function transactionStatusBadge(status: string): string {
  const map: Record<string, string> = {
    'SUCCESS': 'badge-success',
    'PENDING': 'badge-warning',
    'FAILED': 'badge-danger',
    'REFUNDED': 'badge-info'
  };
  return map[status] ?? 'badge-gray';
}

export function planTypeBadge(type: string): string {
  const map: Record<string, string> = {
    'PREPAID': 'badge-success',
    'POSTPAID': 'badge-info',
    'DATA': 'badge-warning',
    'TALKTIME': 'badge-gray',
    'COMBO': 'badge-purple'
  };
  return map[type] ?? 'badge-gray';
}
