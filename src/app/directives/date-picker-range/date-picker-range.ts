import {
    Component,
    OnInit,
    ViewChild,
    Input,
    OnDestroy,
    Optional,
    Self,
    ElementRef,
    ViewEncapsulation,
    Renderer2,
    ChangeDetectionStrategy
  } from "@angular/core";
  import {
    FormBuilder,
    FormGroup,
    FormControl,
    ControlValueAccessor,
    NgControl
  } from "@angular/forms";
  import { coerceBooleanProperty } from "@angular/cdk/coercion";
  import { FocusMonitor } from "@angular/cdk/a11y";
  import { MatCalendar } from "@angular/material/datepicker";
  import { Subject } from "rxjs";
  import { delay, startWith } from "rxjs/operators";
import { MatFormFieldControl } from "@angular/material/form-field";
import { MatMenuTrigger } from "@angular/material/menu";
  
  @Component({
    selector: "date-picker-range",
    templateUrl: "./date-picker-range.html",
    styleUrls: ["./date-picker-range.css"],
    encapsulation: ViewEncapsulation.None,
  
    providers: [
      { provide: MatFormFieldControl, useExisting: DatePickerRangeComponent }
    ],
    host: {
      "[class.example-floating]": "shouldLabelFloat",
      "[id]": "id",
      "[attr.aria-describedby]": "describedBy"
    }
  })
  export class DatePickerRangeComponent
    implements
      OnInit,
      ControlValueAccessor,
      MatFormFieldControl<any[]>,
      OnDestroy {
    from = new FormControl();
    to = new FormControl();
    _dateFrom: number;
    _dateTo: number;
    date;
    get dateFrom() {
      return this._dateFrom ? new Date(this._dateFrom) : null;
    }
    get dateTo() {
      return this._dateTo ? new Date(this._dateTo) : null;
    }
    set dateFrom(value) {
      this._dateFrom = value ? value.getTime() : 0;
      this.from.setValue(this.format(value));
      this.value = { from: this.dateFrom, to: this.dateTo };
    }
    set dateTo(value) {
      this._dateTo = value ? value.getTime() : 0;
      this.to.setValue(this.format(value));
      this.value = { from: this.dateFrom, to: this.dateTo };
    }
    cells: any[];
    separator: string;
    order: number[] = [];
  
    @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  
    /*Variables to make an angular custom form control*/
    controlType = "date-picker-range";
    static nextId = 0;
    static ngAcceptInputType_disabled: boolean | string | null | undefined;
    id = `date-picker-range-${DatePickerRangeComponent.nextId++}`;
    describedBy = "";
    onChange = (_: any) => {};
    onTouched = () => {};
  
    stateChanges = new Subject<void>();
    focused = false;
    get errorState() {
      return this.ngControl
        ? this.ngControl.invalid && this.ngControl.touched
        : false;
    }
    get empty() {
      return !this.from.value && !this.to.value;
    }
    get shouldLabelFloat() {
      return this.focused || !this.empty;
    }
    @Input()
    get placeholder(): string {
      return this._placeholder;
    }
    set placeholder(value: string) {
      this._placeholder = value;
      this.stateChanges.next();
    }
    private _placeholder: string = "YYYY-MM-DD";
  
    @Input()
    get required(): boolean {
      return this._required;
    }
    set required(value: boolean) {
      this._required = coerceBooleanProperty(value);
      this.stateChanges.next();
    }
    private _required = false;
  
    @Input()
    get disabled(): boolean {
      return this._disabled;
    }
    set disabled(value: boolean) {
      this._disabled = coerceBooleanProperty(value);
      if (this._disabled) {
        this.from.disable();
        this.to.disable();
      } else {
        this.from.enable();
        this.to.enable();
      }
      this.stateChanges.next();
    }
    private _disabled = false;
  
    _value: any;
    dateOver: any;
    @Input()
    get value(): any | null {
      return this._value;
    }
    set value(value: any | null) {
      this._value = value;
      this.onChange(value);
      this.stateChanges.next();
    }
  
    /*Function give class to the calendar*/
    setClass() {
      return (date: any) => {
        if (date.getDate() == 1) this.setCells();
        const time = new Date(
          date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        ).getTime();
        let classCss = "";
        if (time >= this._dateFrom && time <= this._dateTo) {
          classCss = "inside";
          if (time == this._dateFrom) classCss += " from";
          if (time == this._dateTo) classCss += " to";
        }
        return classCss;
      };
    }
    constructor(
      private renderer: Renderer2,
      private _focusMonitor: FocusMonitor,
      private _elementRef: ElementRef<HTMLElement>,
      @Optional() @Self() public ngControl: NgControl
    ) {
      _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
        if (this.focused && !origin) {
          this.onTouched();
        }
        this.focused = !!origin;
        this.stateChanges.next();
      });
  
      if (this.ngControl != null) {
        this.ngControl.valueAccessor = this;
      }
    }
    /*Methods implements ControlValueAccessor and MatFormFieldControl<any[]>*/
    ngOnDestroy() {
      this.stateChanges.complete();
      this._focusMonitor.stopMonitoring(this._elementRef);
    }
  
    setDescribedByIds(ids: string[]) {
      this.describedBy = ids.join(" ");
    }
  
    onContainerClick(event: MouseEvent) {
      if ((event.target as Element).tagName.toLowerCase() != "input") {
        this._elementRef.nativeElement.querySelector("input")!.focus();
      }
    }
    writeValue(value: any | null): void {
      this._dateFrom = value ? value.from : null;
      this._dateTo = value ? value.to : null;
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
    }
  
    change(value, key) {
      this.onTouched();
    }
  
    /*Methods componetn itself*/
    ngOnInit() {
      this.separator = this._placeholder.replace(/[YMD]/g, "").substr(0, 1);
      const parts = this._placeholder.replace(/[.\/]/g, "-").split("-");
      this.order[0] = parts.indexOf("YYYY");
      this.order[1] = parts.indexOf("MM");
      this.order[2] = parts.indexOf("DD");
  
      if (!this.from.value && this._dateFrom)
        this.dateFrom = this.parse(this.format(new Date(this._dateFrom)));
      if (!this.to.value && this._dateTo)
        this.dateTo = this.parse(this.format(new Date(this._dateTo)));
  
      this.from.valueChanges.subscribe(res => {
        const date = this.parse(res);
        this._dateFrom = date ? date.getTime() : 0;
        this.value = { from: this.dateFrom, to: this.dateTo };
      });
      this.to.valueChanges.subscribe(res => {
        const date = this.parse(res);
        this._dateTo = date ? date.getTime() : 0;
        this.value = { from: this.dateFrom, to: this.dateTo };
      });
    }
    select(date: any) {
      date = new Date(
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
      if (
        !this.from.value ||
        (this.from.value && this.to.value) ||
        this._dateFrom > date.getTime()
      ) {
        this.dateFrom = date;
        this.dateTo = null;
        this.redrawCells(date.getTime());
      } else {
        this.dateTo = date;
        this.trigger.closeMenu();
      }
    }
    format(date: any) {
      if (!date) return null;
      const parts = [
        "" + date.getFullYear(),
        ("00" + (date.getMonth() + 1)).slice(-2),
        ("00" + date.getDate()).slice(-2)
      ];
      return (
        parts[this.order[0]] +
        this.separator +
        parts[this.order[1]] +
        this.separator +
        parts[this.order[2]]
      );
    }
    parse(value: string) {
      const parts = value ? value.replace(/[.\/]/g, "-").split("-") : [];
      const date: any =
        parts.length == 3
          ? new Date(
              parts[this.order[0]] +
                "-" +
                parts[this.order[1]] +
                "-" +
                parts[this.order[2]]
            )
          : null;
      return date && date.getTime && date.getTime() ? date : null;
    }
    tryFormat(
      value: string,
      control: FormControl,
      calendar: MatCalendar<any> = null
    ) {
      const date = this.parse(value);
      if (date) {
        if (calendar && calendar.activeDate.getMonth() != date.getMonth())
          calendar.activeDate = date;
        else
          this.redrawCells(this._dateTo);
      }
      else
        this.redrawCells(0);
  
      control.setValue(date ? this.format(date) : value, { emitEvent: false });
  
    }
    setCells() {
      setTimeout(() => {
        if (this.cells) {
          this.cells.forEach(x => {
            x.listen();
          });
        }
        this.dateOver = null;
        let elements = document.querySelectorAll(".calendar");
        if (!elements || elements.length == 0) return;
        const cells = elements[0].querySelectorAll(".mat-calendar-body-cell");
        this.cells = [];
        cells.forEach((x, index) => {
          const date = new Date(x.getAttribute("aria-label"));
          const time=new Date(
              date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" +
                date.getDate()
            ).getTime()
          this.cells.push({
            date: time,
            element: x,
            change:time>=this._dateFrom && time<=this._dateTo
          });
        });
        this.cells.forEach(x => {
          if (!x.listen) {
            x.listen = this.renderer.listen(x.element, "mouseover", () => {
              if (!this._dateTo && this.dateOver != x.date) {
                this.dateOver = x.date;
                this.redrawCells(this.dateOver);
              }
            });
          }
        });
      });
    }
    onOpen(calendar) {
      if (this._dateFrom) {
        const date = new Date(this._dateFrom);
        if (
          calendar &&
          this._dateFrom &&
          calendar.activeDate.getMonth() != date.getMonth()
        )
          calendar.activeDate = date;
      }
      this.setCells();
    }
    redrawCells(timeTo: number) {
      timeTo = timeTo || this._dateTo;
      if (timeTo<this._dateFrom)
        timeTo=this._dateFrom
      this.cells.forEach(x => {
        const change = (this._dateFrom && x.date >= this._dateFrom) && x.date <= timeTo;
        if (change || x.change) {
          x.change = change;
          const addInside = x.change ? "addClass" : "removeClass";
          const addFrom =
            x.date == this._dateFrom
              ? "addClass"
              : x.date == timeTo && this._dateFrom==timeTo
              ? "addClass"
              : "removeClass";
          const addTo =
            x.date == timeTo
              ? "addClass"
              : x.date == this._dateFrom && this._dateFrom==timeTo
              ? "addClass"
              : "removeClass";
  
          this.renderer[addInside](x.element, "inside");
          this.renderer[addFrom](x.element, "from");
          this.renderer[addTo](x.element, "to");
        }
      });
    }
  
  }
  