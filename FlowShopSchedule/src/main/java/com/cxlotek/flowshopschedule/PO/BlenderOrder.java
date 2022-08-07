package com.cxlotek.flowshopschedule.PO;

import com.alibaba.excel.annotation.ExcelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * blender_order
 * @author 
 */
public class BlenderOrder implements Serializable {
    /**
     * 单号
     */
    @ExcelProperty("单号")
    private String orderId;

    /**
     * 客户名称
     */
    @ExcelProperty("客户名称")
    private String customerName;

    /**
     * 流水线一计划开始日期
     */
    @ExcelProperty("流水线一计划开始日期")
    private Date plannedStartDate0;

    /**
     * 流水线二计划开始日期
     */
    @ExcelProperty("流水线二计划开始日期")
    private Date plannedStartDate1;

    /**
     * 计划结束日期
     */
    @ExcelProperty("计划结束日期")
    private Date plannedEndDate;

    /**
     * 实际开始日期
     */
    private Date startDate;

    /**
     * 订单数量
     */
    @ExcelProperty("订单数量")
    private Integer orderQuantity;

    /**
     * 产品型号
     */
    @ExcelProperty("产品型号")
    private String productModel;

    /**
     * 跟单员
     */
    private String merchandiser;

    /**
     * 备注
     */
    private String comment;

    /**
     * 所属文件
     */
    private String fileNumber;

    private static final long serialVersionUID = 1L;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Date getPlannedStartDate0() {
        return plannedStartDate0;
    }

    public void setPlannedStartDate0(Date plannedStartDate0) {
        this.plannedStartDate0 = plannedStartDate0;
    }

    public Date getPlannedStartDate1() {
        return plannedStartDate1;
    }

    public void setPlannedStartDate1(Date plannedStartDate1) {
        this.plannedStartDate1 = plannedStartDate1;
    }

    public Date getPlannedEndDate() {
        return plannedEndDate;
    }

    public void setPlannedEndDate(Date plannedEndDate) {
        this.plannedEndDate = plannedEndDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Integer getOrderQuantity() {
        return orderQuantity;
    }

    public void setOrderQuantity(Integer orderQuantity) {
        this.orderQuantity = orderQuantity;
    }

    public String getProductModel() {
        return productModel;
    }

    public void setProductModel(String productModel) {
        this.productModel = productModel;
    }

    public String getMerchandiser() {
        return merchandiser;
    }

    public void setMerchandiser(String merchandiser) {
        this.merchandiser = merchandiser;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getFileNumber() {
        return fileNumber;
    }

    public void setFileNumber(String fileNumber) {
        this.fileNumber = fileNumber;
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
        BlenderOrder other = (BlenderOrder) that;
        return (this.getOrderId() == null ? other.getOrderId() == null : this.getOrderId().equals(other.getOrderId()))
            && (this.getCustomerName() == null ? other.getCustomerName() == null : this.getCustomerName().equals(other.getCustomerName()))
            && (this.getPlannedStartDate0() == null ? other.getPlannedStartDate0() == null : this.getPlannedStartDate0().equals(other.getPlannedStartDate0()))
            && (this.getPlannedStartDate1() == null ? other.getPlannedStartDate1() == null : this.getPlannedStartDate1().equals(other.getPlannedStartDate1()))
            && (this.getPlannedEndDate() == null ? other.getPlannedEndDate() == null : this.getPlannedEndDate().equals(other.getPlannedEndDate()))
            && (this.getStartDate() == null ? other.getStartDate() == null : this.getStartDate().equals(other.getStartDate()))
            && (this.getOrderQuantity() == null ? other.getOrderQuantity() == null : this.getOrderQuantity().equals(other.getOrderQuantity()))
            && (this.getProductModel() == null ? other.getProductModel() == null : this.getProductModel().equals(other.getProductModel()))
            && (this.getMerchandiser() == null ? other.getMerchandiser() == null : this.getMerchandiser().equals(other.getMerchandiser()))
            && (this.getComment() == null ? other.getComment() == null : this.getComment().equals(other.getComment()))
            && (this.getFileNumber() == null ? other.getFileNumber() == null : this.getFileNumber().equals(other.getFileNumber()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getOrderId() == null) ? 0 : getOrderId().hashCode());
        result = prime * result + ((getCustomerName() == null) ? 0 : getCustomerName().hashCode());
        result = prime * result + ((getPlannedStartDate0() == null) ? 0 : getPlannedStartDate0().hashCode());
        result = prime * result + ((getPlannedStartDate1() == null) ? 0 : getPlannedStartDate1().hashCode());
        result = prime * result + ((getPlannedEndDate() == null) ? 0 : getPlannedEndDate().hashCode());
        result = prime * result + ((getStartDate() == null) ? 0 : getStartDate().hashCode());
        result = prime * result + ((getOrderQuantity() == null) ? 0 : getOrderQuantity().hashCode());
        result = prime * result + ((getProductModel() == null) ? 0 : getProductModel().hashCode());
        result = prime * result + ((getMerchandiser() == null) ? 0 : getMerchandiser().hashCode());
        result = prime * result + ((getComment() == null) ? 0 : getComment().hashCode());
        result = prime * result + ((getFileNumber() == null) ? 0 : getFileNumber().hashCode());
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
        sb.append(", plannedStartDate0=").append(plannedStartDate0);
        sb.append(", plannedStartDate1=").append(plannedStartDate1);
        sb.append(", plannedEndDate=").append(plannedEndDate);
        sb.append(", startDate=").append(startDate);
        sb.append(", orderQuantity=").append(orderQuantity);
        sb.append(", productModel=").append(productModel);
        sb.append(", merchandiser=").append(merchandiser);
        sb.append(", comment=").append(comment);
        sb.append(", fileNumber=").append(fileNumber);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}