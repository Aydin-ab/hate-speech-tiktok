import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootPanelComponent } from './root-panel.component';

describe('RootPanelComponent', () => {
  let component: RootPanelComponent;
  let fixture: ComponentFixture<RootPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
