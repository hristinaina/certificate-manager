package com.example.certificateback.dto;

import com.example.certificateback.domain.CertificateRequest;
import com.example.certificateback.domain.User;
import com.example.certificateback.enumeration.CertificateType;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequestDTO {

    private Long id;
    private String requestType;

    private String issuer;  // serial number of certificate

    private String certificateType;

    private UserDTO subject;

    private String refusalReason;

    public CertificateRequestDTO(CertificateRequest request) {
        this.id = request.getId();
        this.requestType = request.getRequestType().toString();
        if (request.getCertificateType() != CertificateType.ROOT)
            this.issuer = request.getIssuer().getSerialNumber();
        this.certificateType = request.getCertificateType().toString();
        this.refusalReason = request.getRefusalReason();
        this.subject = new UserDTO(request.getSubject());
    }
}
