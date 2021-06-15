package com.rnscanbarcode.RNCamera.camera.events;

import androidx.core.util.Pools;

import com.rnscanbarcode.RNCamera.camera.CameraViewManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class CameraMountErrorEvent extends Event<CameraMountErrorEvent> {
  private static final Pools.SynchronizedPool<CameraMountErrorEvent> EVENTS_POOL = new Pools.SynchronizedPool<>(3);
  private String mError;

  private CameraMountErrorEvent() {
  }

  public static com.rnscanbarcode.RNCamera.camera.events.CameraMountErrorEvent obtain(int viewTag, String error) {
    com.rnscanbarcode.RNCamera.camera.events.CameraMountErrorEvent event = EVENTS_POOL.acquire();
    if (event == null) {
      event = new com.rnscanbarcode.RNCamera.camera.events.CameraMountErrorEvent();
    }
    event.init(viewTag, error);
    return event;
  }

  private void init(int viewTag, String error) {
    super.init(viewTag);
    mError = error;
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  public String getEventName() {
    return CameraViewManager.Events.EVENT_ON_MOUNT_ERROR.toString();
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    WritableMap arguments = Arguments.createMap();
    arguments.putString("message", mError);
    return arguments;
  }
}
