import { TestBed } from "@angular/core/testing";

import { IonicPopupsService } from "./ionic-popups.service";

describe("IonicPopupsService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: IonicPopupsService = TestBed.get(IonicPopupsService);
    expect(service).toBeTruthy();
  });
});
