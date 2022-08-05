export const formatter = (value) => `${Number(isNaN(value) ? '0' : value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
export const parser = (value) => value.replace(/\$\s?|(,*)/g, "")