package com.rnscanbarcode.RNCamera.camera.tasks;

import com.facebook.react.bridge.WritableMap;

public interface PictureSavedDelegate {
    void onPictureSaved(WritableMap response);
}
