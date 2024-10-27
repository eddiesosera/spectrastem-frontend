class DropdownManager {
  private static instance: DropdownManager;
  private activeDropdownId: string | null = null;
  private closeCurrentDropdownCallback: (() => void) | null = null;
  private listeners: Set<(id: string | null) => void> = new Set();

  private constructor() {}

  public static getInstance() {
    if (!DropdownManager.instance) {
      DropdownManager.instance = new DropdownManager();
    }
    return DropdownManager.instance;
  }

  public openDropdown(id: string, closeCallback: () => void) {
    if (
      this.activeDropdownId &&
      this.activeDropdownId !== id &&
      this.closeCurrentDropdownCallback
    ) {
      this.closeCurrentDropdownCallback();
    }
    this.activeDropdownId = id;
    this.closeCurrentDropdownCallback = closeCallback;
    this.notifyListeners();
  }

  public closeDropdown() {
    this.activeDropdownId = null;
    this.closeCurrentDropdownCallback = null;
    this.notifyListeners();
  }
  public isActive(id: string): boolean {
    return this.activeDropdownId === id;
  }

  public addListener(listener: (id: string | null) => void) {
    this.listeners.add(listener);
  }

  public removeListener(listener: (id: string | null) => void) {
    this.listeners.delete(listener);
  }

  // Notify all listeners about the active dropdown change
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.activeDropdownId));
  }
}

export default DropdownManager;
