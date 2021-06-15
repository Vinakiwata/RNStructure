package com.rnscanbarcode.RNCamera.camera.events;

import androidx.core.util.Pools;

import com.rnscanbarcode.RNCamera.camera.CameraViewManager;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class PictureSavedEvent extends Event<PictureSavedEvent> {
    private static final Pools.SynchronizedPool<PictureSavedEvent> EVENTS_POOL = new Pools.SynchronizedPool<>(5);
    private PictureSavedEvent() {}
    
    private WritableMap mResponse;
    
    public static com.rnscanbarcode.RNCamera.camera.events.PictureSavedEvent obtain(int viewTag, WritableMap response) {
        com.rnscanbarcode.RNCamera.camera.events.PictureSavedEvent event = EVENTS_POOL.acquire();
        if (event == null) {
            event = new com.rnscanbarcode.RNCamera.camera.events.PictureSavedEvent();
        }
        event.init(viewTag, response);
        return event;
    }
    
    private void init(int viewTag, WritableMap response) {
        super.init(viewTag);
        mResponse = response;
    }
    
    @Override
    public short getCoalescingKey() {
        int hashCode = mResponse.getMap("data").getString("uri").hashCode() % Short.MAX_VALUE;
        return (short) hashCode;
    }
    
    @Override
    public String getEventName() {
        return CameraViewManager.Events.EVENT_ON_PICTURE_SAVED.toString();
    }
    
    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), mResponse);
    }
}
