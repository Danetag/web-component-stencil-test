export declare class SimpleButton {
    /**
     * Show number of clicks
     */
    showNbOfClick: boolean;
    /**
     * theme
     */
    theme: string;
    validateTheme(newValue: string): void;
    /**
     * Number of clicks
     */
    nbOfClicks: number;
    componentWillLoad(): void;
    handleClick: () => void;
    render(): any;
}
