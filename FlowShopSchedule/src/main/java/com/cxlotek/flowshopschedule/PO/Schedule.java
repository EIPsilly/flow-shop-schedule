package com.cxlotek.flowshopschedule.PO;

import java.io.Serializable;
import java.util.Date;

/**
 * schedule
 * @author
 */
public class Schedule implements Serializable {
    /**
     * 订单号
     */
    private Integer orderId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 所属文件
     */
    private String fileNumber;

    /**
     * 日期
     */
    private Date date;

    /**
     * 生产数量
     */
    private Integer productionQuantity;

    /**
     * 流水线序号
     */
    private Integer lineNumber;

    /**
     * 产品型号
     */
    private String productModel;

    private static final long serialVersionUID = 1L;

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getFileNumber() {
        return fileNumber;
    }

    public void setFileNumber(String fileNumber) {
        this.fileNumber = fileNumber;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getProductionQuantity() {
        return productionQuantity;
    }

    public void setProductionQuantity(Integer productionQuantity) {
        this.productionQuantity = productionQuantity;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getProductModel() {
        return productModel;
    }

    public void setProductModel(String productModel) {
        this.productModel = productModel;
    }

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Schedule other = (Schedule) that;
        return (this.getOrderId() == null ? other.getOrderId() == null : this.getOrderId().equals(other.getOrderId()))
                && (this.getCustomerName() == null ? other.getCustomerName() == null : this.getCustomerName().equals(other.getCustomerName()))
                && (this.getFileNumber() == null ? other.getFileNumber() == null : this.getFileNumber().equals(other.getFileNumber()))
                && (this.getDate() == null ? other.getDate() == null : this.getDate().equals(other.getDate()))
                && (this.getProductionQuantity() == null ? other.getProductionQuantity() == null : this.getProductionQuantity().equals(other.getProductionQuantity()))
                && (this.getLineNumber() == null ? other.getLineNumber() == null : this.getLineNumber().equals(other.getLineNumber()))
                && (this.getProductModel() == null ? other.getProductModel() == null : this.getProductModel().equals(other.getProductModel()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getOrderId() == null) ? 0 : getOrderId().hashCode());
        result = prime * result + ((getCustomerName() == null) ? 0 : getCustomerName().hashCode());
        result = prime * result + ((getFileNumber() == null) ? 0 : getFileNumber().hashCode());
        result = prime * result + ((getDate() == null) ? 0 : getDate().hashCode());
        result = prime * result + ((getProductionQuantity() == null) ? 0 : getProductionQuantity().hashCode());
        result = prime * result + ((getLineNumber() == null) ? 0 : getLineNumber().hashCode());
        result = prime * result + ((getProductModel() == null) ? 0 : getProductModel().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", orderId=").append(orderId);
        sb.append(", customerName=").append(customerName);
        sb.append(", fileNumber=").append(fileNumber);
        sb.append(", date=").append(date);
        sb.append(", productionQuantity=").append(productionQuantity);
        sb.append(", lineNumber=").append(lineNumber);
        sb.append(", productModel=").append(productModel);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}