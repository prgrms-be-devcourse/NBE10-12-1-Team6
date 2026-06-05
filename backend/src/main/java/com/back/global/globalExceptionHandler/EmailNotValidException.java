package com.back.global.globalExceptionHandler;

public class EmailNotValidException extends RuntimeException {

    public EmailNotValidException() {
        super("이메일 형식이 올바르지 않습니다.");
    }
}
