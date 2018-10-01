import { CSSProperties, Component, SFCElement, createElement } from "react";
import { Label } from "./Label";
import { Switch, SwitchProps, SwitchStatus } from "./Switch";

interface SwitchContainerProps {
    class: string;
    style: CSSProperties;
    booleanAttribute: PluginWidget.EditableValue<boolean>;
    colorStyle: ColorStyle;
    deviceStyle: DeviceStyle;
    editable: "default" | "never";
    label: PluginWidget.DynamicValue<string>;
    labelWidth: number;
    onChangeAction?: PluginWidget.ActionValue;
}

type ColorStyle = "default" | "primary" | "inverse" | "info" | "warning" | "success" | "danger";
type DeviceStyle = "auto" | "android" | "iOS";
type Handler = () => void;

class SwitchContainer extends Component<SwitchContainerProps> {
    private readonly toggleHandler: Handler = this.handleToggle.bind(this);

    render() {
        const maxLabelWidth = 11;
        if (this.props.label.value && this.props.label.value.trim()) {
            return createElement(Label, {
                className: `${this.props.deviceStyle} ${this.props.class}`,
                label: this.props.label.value,
                style: this.props.style,
                weight: this.props.labelWidth > maxLabelWidth ? maxLabelWidth : this.props.labelWidth
            }, this.renderSwitch(true));
        }

        return this.renderSwitch();
    }

    private renderSwitch(hasLabel = false): SFCElement<SwitchProps> {
        const { booleanAttribute, class: className, colorStyle, deviceStyle, style } = this.props;

        return createElement(Switch, {
            alertMessage: booleanAttribute.validation ? booleanAttribute.validation[0] : "",
            className: !hasLabel ? className : undefined,
            colorStyle,
            deviceStyle,
            isChecked: booleanAttribute.value,
            onClick: this.toggleHandler,
            status: this.getSwitchStatus(!this.isReadOnly()),
            style: !hasLabel ? style : undefined
        } as SwitchProps);
    }

    private isReadOnly() {
        const { booleanAttribute, editable } = this.props;

        return editable === "default" ? booleanAttribute.readOnly : true;
    }

    private getSwitchStatus(enabled: boolean): SwitchStatus {
        if (this.props.booleanAttribute.status !== PluginWidget.ValueStatus.Available) {
            return "no-context";
        }

        return enabled ? "enabled" : "disabled";
    }

    private handleToggle() {
        const { booleanAttribute } = this.props;
        if (!booleanAttribute.readOnly) {
            booleanAttribute.setValue(!booleanAttribute.value);
            this.executeAction();
        }
    }

    private executeAction() {
        if (this.props.onChangeAction) {
            this.props.onChangeAction.execute();
        }
    }
}

export { ColorStyle, DeviceStyle, SwitchContainer as default, SwitchContainerProps };
