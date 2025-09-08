export function clearContainer(container: HTMLElement) {
  container.innerHTML = ''
}

export function createEl(tag: string, className?: string, inner?: string) {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (inner !== undefined) el.innerHTML = inner
  return el
}
