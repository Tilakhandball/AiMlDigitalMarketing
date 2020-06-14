import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredChannelListComponent } from './preferred-channel-list.component';

describe('PreferredChannelListComponent', () => {
  let component: PreferredChannelListComponent;
  let fixture: ComponentFixture<PreferredChannelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredChannelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
